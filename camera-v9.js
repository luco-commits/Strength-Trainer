import {PoseLandmarker,FilesetResolver,DrawingUtils} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm';
const MP='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm';
const MODEL='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task';
let pose,stream,running=false,raf,lastVideoTime=-1,phase='ready',count=0,lastChange=0;
const cfg={
 'biceps-curl':{kind:'elbow',low:65,high:145,tip:'Face the camera at a slight angle. Keep shoulder, elbow and wrist visible.'},
 'hammer-curl':{kind:'elbow',low:65,high:145,tip:'Face the camera at a slight angle. Keep your working arm visible.'},
 'triceps-extension':{kind:'elbowReverse',low:75,high:150,tip:'Stand side-on enough for shoulder, elbow and wrist to stay visible.'},
 'shoulder-press':{kind:'wristY',up:-.08,down:.08,tip:'Face the camera. Keep your head, shoulders and both wrists in frame.'},
 'lateral-raise':{kind:'wristShoulder',up:.07,down:.22,tip:'Face the camera with your upper body and hands visible.'},
 'chest-fly':{kind:'spread',up:.62,down:.36,tip:'Place the device above/forward enough to see shoulders and both wrists.'},
 'reverse-fly':{kind:'spread',up:.62,down:.38,tip:'Face the camera while hinged so shoulders and hands remain visible.'},
 'rear-delt-row':{kind:'elbow',low:80,high:145,tip:'Use a three-quarter view and keep shoulder, elbow and wrist visible.'},
 'one-arm-row':{kind:'elbow',low:75,high:145,tip:'Use a side/three-quarter view of the working arm.'},
 'floor-press':{kind:'elbowReverse',low:85,high:150,tip:'Prop the device so your shoulders, elbows and wrists are visible while lying down.'},
 'wall-pushup':{kind:'elbowReverse',low:85,high:155,tip:'Place the device side-on so your shoulder, elbow and wrist are visible.'},
 'pullover':{kind:'wristYReverse',up:-.13,down:.08,tip:'Prop the device side-on/above so shoulders and wrists remain visible.'}
};
const $=id=>document.getElementById(id);const vis=p=>p&&((p.visibility??1)>.45);
function angle(a,b,c){const ab=[a.x-b.x,a.y-b.y],cb=[c.x-b.x,c.y-b.y];let v=(ab[0]*cb[0]+ab[1]*cb[1])/(Math.hypot(...ab)*Math.hypot(...cb));return Math.acos(Math.max(-1,Math.min(1,v)))*180/Math.PI}
function side(l){const L=[l[11],l[13],l[15]],R=[l[12],l[14],l[16]];return L.every(vis)?L:R.every(vis)?R:null}
function metric(l,c){let s=side(l);if(c.kind==='elbow'||c.kind==='elbowReverse')return s?angle(...s):null;let shY=(l[11].y+l[12].y)/2,wrY=(l[15].y+l[16].y)/2;if(c.kind==='wristY'||c.kind==='wristYReverse')return wrY-shY;if(c.kind==='wristShoulder')return Math.abs(wrY-shY);if(c.kind==='spread')return Math.abs(l[15].x-l[16].x);return null}
function states(v,c){if(c.kind==='elbow')return [v<c.low,v>c.high];if(c.kind==='elbowReverse')return [v>c.high,v<c.low];if(c.kind==='wristY')return [v<c.up,v>c.down];if(c.kind==='wristYReverse')return [v>c.down,v<c.up];if(c.kind==='wristShoulder')return [v<c.up,v>c.down];if(c.kind==='spread')return [v>c.up,v<c.down];return [false,false]}
function process(l){const id=$('exercise').value,c=cfg[id],v=metric(l,c);if(v==null){status('Move so the required joints are visible','warn');return}const [peak,start]=states(v,c),now=performance.now();if(phase==='ready'&&start){phase='start';status('Ready — begin the movement','good')}else if(phase==='start'&&peak&&now-lastChange>250){phase='peak';lastChange=now;status('Good range — return to start','good')}else if(phase==='peak'&&start&&now-lastChange>250){phase='start';lastChange=now;count++;$('count').textContent=count;beep();status('Rep '+count+' counted ✓','good');if(count>=Number($('target').value)){status('Set complete ✓','complete');stopCamera();window.dispatchEvent(new CustomEvent('strength:setComplete',{detail:{reps:count,exercise:id}}))}}}
function status(t,cls=''){$('cameraStatus').textContent=t;$('cameraStatus').className='status '+cls}
function beep(){try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.frequency.value=880;g.gain.value=.08;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+.08)}catch{}}
async function init(){if(pose)return;status('Loading pose model…');const files=await FilesetResolver.forVisionTasks(MP);pose=await PoseLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:MODEL,delegate:'GPU'},runningMode:'VIDEO',numPoses:1,minPoseDetectionConfidence:.55,minTrackingConfidence:.55});status('Model ready. Start the camera.','good')}
async function startCamera(){try{await init();stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280},height:{ideal:720}},audio:false});const v=$('camera');v.srcObject=stream;await v.play();running=true;count=0;phase='ready';$('count').textContent='0';$('cameraBox').classList.add('on');status('Camera active — get into the starting position');loop()}catch(e){console.error(e);status(e.name==='NotAllowedError'?'Camera permission was denied. Allow camera access in your browser settings.':'Could not start camera: '+e.message,'warn')}}
function stopCamera(){running=false;if(raf)cancelAnimationFrame(raf);if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$('cameraBox')?.classList.remove('on')}
function loop(){if(!running)return;const v=$('camera'),cv=$('overlay');if(v.readyState>=2&&v.currentTime!==lastVideoTime){lastVideoTime=v.currentTime;cv.width=v.videoWidth;cv.height=v.videoHeight;pose.detectForVideo(v,performance.now(),r=>{const ctx=cv.getContext('2d');ctx.clearRect(0,0,cv.width,cv.height);if(r.landmarks?.[0]){const d=new DrawingUtils(ctx);d.drawConnectors(r.landmarks[0],PoseLandmarker.POSE_CONNECTIONS,{lineWidth:3});d.drawLandmarks(r.landmarks[0],{radius:3});process(r.landmarks[0])}else status('No person detected — step into view','warn')})}raf=requestAnimationFrame(loop)}
window.StrengthCamera={start:startCamera,stop:stopCamera,reset(){count=0;phase='ready';$('count').textContent='0';status('Counter reset')},tip(){return cfg[$('exercise').value]?.tip||''}};
window.addEventListener('pagehide',stopCamera);