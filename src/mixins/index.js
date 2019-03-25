let imageLimit;
function ImgPlugin (option) {
  imageLimit = option;
  console.log(123);
  return this;
}

ImgPlugin.prototype.install = function (Vue) {
  Vue.mixin({
    methods: {
      beforeAvatarUpload (file) {
        imageLimit.forEach(item => {
          if (this.$options.name === item) {
            const isImg = file.type.indexOf('image/') > -1;
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isImg) {
              this.$message.error('只能上传图片！');
            }
            if (!isLt10M) {
              this.$message.error('上传头像图片大小不能超过10MB!');
            }
            return isImg && isLt10M;
          }
        });
      }
    }
  });
};
// export const beforeAvatar = {
//   methods: {
//     beforeAvatarUpload (file) {
//       const isImg = file.type.indexOf('image/') > -1;
//       const isLt10M = file.size / 1024 / 1024 < 10;

//       if (!isImg) {
//         this.$message.error('只能上传图片！');
//       }
//       if (!isLt10M) {
//         this.$message.error('上传头像图片大小不能超过10MB!');
//       }
//       return isImg && isLt10M;
//     }
//   }
// };
export default ImgPlugin;
