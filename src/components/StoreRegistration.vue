<template>
  <div>
    <marketmap @location-updated="updateLocation" />
  </div>
  <div class="form-container">
    <v-btn @click="openGallery"><v-icon>mdi-camera</v-icon>대표사진등록</v-btn>
    <input type="file" ref="fileInput" style="display:none" @change="uploadFile">
    <h2>상점 등록</h2>
    <div v-if="images.length > 0" class="gallery">
      <div v-for="(image, index) in images" :key="index">
        <img :src="image" alt="gallery" class="gallery-image">
        <form @submit.prevent="addStore(image)">
          <label>상점 번호 :</label>
          <input type="number" v-model="store.Stnum" />
          <br />
          <label>상점 이름 :</label>
          <input type="text" v-model="store.storename" />
          <br />
          <label>상점 위치 :</label>
          <input type="text" v-model="store.location" />
          <br />
          <button type="submit">가게 등록하기</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { reactive } from 'vue';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import marketmap from '@/components/marketmap.vue';

const firebaseConfig = {
  // Firebase Configurations
  apiKey: "AIzaSyAjh-tLB9jHUFxtvf1OlFTN4TU9p0u-VTQ",
  authDomain: "tdmk-595a3.firebaseapp.com",
  databaseURL: "https://tdmk-595a3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tdmk-595a3",
  storageBucket: "tdmk-595a3.appspot.com",
  messagingSenderId: "849130639775",
  appId: "1:849130639775:web:e4d64bda00fd4a4d89adaa",
  measurementId: "G-QXH609W16C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storesCollection = collection(db, 'stores');
const auth = getAuth(app);

export default {
  name: "StoreRegistration",
  components: {
    marketmap
  },
  setup() {
    const store = reactive({ image: '', Stnum: '', storename: '', location: '' });
    const user = reactive({ uid: '' });

    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        user.uid = firebaseUser.uid;
      } else {
        user.uid = '';
      }
    });

    const addStore = async (image) => {
  try {
    // 모든 필드가 비어있는지 확인
    if (!store.Stnum) {
      alert('상점 번호를 입력해주세요!');
      return;
    }
    if (!store.storename) {
      alert('상점 이름을 입력해주세요!');
      return;
    }
    if (!store.location) {
      alert('상점 위치정보를 클릭해주세요!');
      return;
    }
    if (!image) {
      alert('이미지를 업로드해주세요!');
      return;
    }

    // 상점 번호 중복 체크
    const querySnapshot = await getDocs(query(collection(db, 'stores'), where('Stnum', '==', store.Stnum)));
    if (!querySnapshot.empty) {
      alert('이미 등록된 상점 번호입니다!');
      return;
    }

    // 이미지 업로드 및 URL 가져오기
    const storage = getStorage();
    const imageName = `image_${Date.now()}.png`;
    const imageRef = storageRef(storage, `images/${imageName}`);
    const base64String = image.split(',')[1];
    const bytes = new Uint8Array(atob(base64String).split('').map((char) => char.charCodeAt(0)));
    await uploadBytes(imageRef, bytes);
    console.log('이미지 업로드 성공!');
    const imageUrl = await getDownloadURL(imageRef);

    // 상점 등록
    await addDoc(storesCollection, {
      Stnum: store.Stnum,
      storename: store.storename,
      location: store.location,
      image: imageUrl,
      uid: user.uid
    });

    // 입력 필드 초기화
    store.Stnum = '';
    store.storename = '';
    store.location = '';
    alert('상점 등록에 성공하였습니다');
    console.log('Success to store sumbit!');
  } catch (error) {
    alert('상점 등록에 실패하였습니다', error);
    console.log('fail to store sumbit!', error);
  }
};


    const updateLocation = (location) => {
      store.location = location;
    };

    return {
      store,
      addStore,
      updateLocation,
      user
    };
  },
  data() {
    return {
      images: [],
      constraints: {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }
    };
  },
  methods: {
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
        const videoElement = this.$refs.video;
        videoElement.srcObject = stream;
        await videoElement.play();
      } catch (error) {
        console.error('카메라 시작 오류:', error);
      }
    },
    takePicture() {
      const canvas = this.$refs.canvas;
      const video = this.$refs.video;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const image = canvas.toDataURL('image/png');
      this.images.push(image);
    },
    openGallery() {
      this.$refs.fileInput.click();
    },
    uploadFile(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.images.push(reader.result);
      };
    }
  }
};
</script>
<style>
.camera {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.gallery img {
  max-width: 100%;
  margin: 10px;
}

.empty-window {
  width: 400px;
  height: 300px;
  border: 2px dashed #ccc;
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: #999;
  position: relative;
}

.uploaded-image {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  object-fit: cover;
}

/* Added styles */
.gallery-image {
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.gallery-image:hover {
  opacity: 0.8;
}

.empty-window:hover {
  border-color: #999;
}

.empty-window::before {
  content: "+";
  font-size: 3rem;
  color: #ccc;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.form-container label {
  display: block;
  margin-bottom: 10px;
}

.form-container input[type="number"],
.form-container input[type="text"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-container button[type="submit"] {
  width: 100%;
  padding: 10px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}


</style>
