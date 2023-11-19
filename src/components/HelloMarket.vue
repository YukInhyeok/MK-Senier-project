<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="Main">
        <v-carousel hide-delimiters cycle interval="5000" hide-controls>
          <v-carousel-item v-for="(item, index) in imageArray" :key="index">
            <v-img :src="item.src" :alt="item.alt"></v-img>
          </v-carousel-item>
        </v-carousel>

      </v-col>
      <v-col rows="10" class="BTN">
        <v-row justify="center">
          <v-col cols="6">
            <v-btn class="button-spacing" size="small">
              <a href="http://www.djone.kr/srv/ntc.do" target="_blank">공지사항</a>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn class="button-spacing" size="large">
              <a href="http://www.djone.kr/srv/fct.do" target="_blank">편의시설</a>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn class="button-spacing" size="large">
              <a href="http://www.djone.kr/srv/tra.do" target="_blank">오시는길</a>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn class="button-spacing" size="large">
              <a href="http://www.djone.kr/srv/tra.do" target="_blank">오시는길</a>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col class="mb-5" cols="12" md="6">
        <h2 class="headline font-weight-bold mb-5 text-center" style="font-size: 16px;">고객센터 전화번호</h2>
        <v-row justify="center">
          <a style="padding-bottom: 70px;"
            v-for="(next, i) in CoustomerCenter"
            :key="i"
            :href="next.href"
            class="subheading mx-3"
            target="_blank">
            {{ next.text }}
          </a>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {VCarousel, VCarouselItem} from 'vuetify';
export default {
  name: 'HelloWorld',

  data: () => ({
    CoustomerCenter: [
      {
        text: '042-226-0319',
        href: 'tel:042-226-0319'
      },
    ],
    imageArray:[
      {
        src : 'https://i.ibb.co/x6HVSZV/Kakao-Talk-20231120-000102731.png',
        alt : 'Image 1',
      },
      {
        src :'https://i.ibb.co/mFgZJsr/Kakao-Talk-20231120-000254703.png',
        alt :'Image 2',
      },
      {
        src : 'https://i.ibb.co/kyn7syd/Kakao-Talk-20231120-000115995.png',
        alt : 'Image 3',
      },
      {
        src : 'https://i.ibb.co/S7KDhtS/Kakao-Talk-20231120-000133270.png',
        alt : 'Image 4',
      },
      {
        src : 'https://i.ibb.co/2nTktJT/Kakao-Talk-20231120-000211861.png',
        alt : 'Image 5',
      }
    ],
  }),
  methods: {
    hideCarouselControls() {
      // 캐러셀 컨트롤(버튼)을 숨기는 메소드
      const carouselControls = document.querySelectorAll('.v-carousel__controls');
      carouselControls.forEach((control) => {
        control.style.display = 'none';
      });
    },
  },
  mounted() {
    this.hideCarouselControls(); // 컴포넌트가 마운트될 때 캐러셀 컨트롤 숨김
  },
  components: {
    VCarousel,
    VCarouselItem
  },
}
</script>
<style scoped>
.Main {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.BTN {
  margin-top: 60px;
  margin-bottom: 150px;
}

.v-btn {
  /* 버튼에 대한 스타일을 지정합니다 */
  width: 180px;
  height: 40px;
  border: 1px solid #34495e;
  text-align: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  margin: 0 auto;
}

.v-btn a {
  /* 링크에 대한 스타일을 지정합니다 */
  font-family: arial;
  font-size: 18px;
  color: #34495e;
  text-decoration: none;
  transition: all 0.5s ease;
  z-index: 2;
  position: relative;
}

.v-btn:hover {
  /* 버튼에 호버 효과를 추가합니다 */
  background-color: #34495e;
}

.v-btn:hover a {
  /* 호버 시 링크에 대한 스타일을 변경합니다 */
  color: #fff;
}

.button-spacing {
  width: 180px;
  
  text-align: center;
}

.mb-5 {
  margin-bottom: 2.5rem; /* 고객센터 전화번호 제목의 하단 여백을 설정합니다 */
}

.text-center {
  text-align: center; /* 가운데 정렬을 설정합니다 */
}
.v-col-6 {
    text-align: center;
    flex: 0 0 50%;
    max-width: 50%;
}

a {
  list-style: none;
  text-decoration: none;
}

.v-btn__overlay{
  display: none !important;
}
.v-btn__underlay {
  display: none !important;
}
</style>
