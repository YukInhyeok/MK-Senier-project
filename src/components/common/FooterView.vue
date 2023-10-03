<template>
    <div class="footer">
        <div class="footer-wrap">
            <img :src="src[0].footerUrl" />
            <div class="footer_right">
            <h1 style="font-size:19px;">Information & Communication</h1>
            <h1 style="font-size: 20px; font-weight: bold;">Graduation Project: TraditionalMarket</h1>
            <p style="font-size: 18px;">Made by 융합 3조</p>
            <p style="font-size: 15px;">Leader: Youngwon Choi</p>
            <p style="font-size: 14px;">Member: Jaeseong Na</p>
            <p style="font-size: 14px;">Member: Hyunbin Yeom</p>
            <p style="font-size: 14px;">Member: Inhyeok Yuk</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            src: [{
                footerUrl: require("@/images/footer.jpg") // Adjust the path as needed
            }]
        };
    }
};
</script>

<style>
.footer {
    width: 100%;
    height: 100%;
    position: sticky;
    border-top: 1px solid #a6a7a8;
    text-align: center;
}
.footer img {
    width: 50%;
    height: 50%;
   
}

.footer-wrap {
    padding: 15px;
}


</style>
