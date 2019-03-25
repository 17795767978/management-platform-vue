<template>
  <div class="login-container">
    <el-form
      class="login-form"
      autocomplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left">
      <div class="title-container">
        <h3 class="title">好乐管理后台1.1.0</h3>
      </div>
      <el-form-item prop="username">
                <span class="icon-container icon-container_login">
                    <i class="fa fa-user"></i>
                </span>
        <el-input
          type="text"
          size="large"
          v-model="loginForm.username"
          autoComplete="on"
          placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
                <span class="icon-container">
                    <i class="fa fa-lock"></i>
                </span>
        <el-input
          type="password"
          size="large"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          autoComplete="on"
          placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-button
        class="login-btn"
        type="primary"
        :loading="loading"
        size="large"
        @click.native.prevent="handleLogin">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入账号'));
        } else {
          callback();
        }
      };

      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码不能少于6位'));
        } else {
          callback();
        }
      };

      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [
            {
              required: true,
              trigger: 'blur',
              validator: validateUsername
            }
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword
            }
          ]
        },
        loading: false
      };
    },
    methods: {
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
              this.$router.push({path: '/'});
            });
          }
        });
      }
    }
  };
</script>

<style lang="scss">
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 260px;
      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 10px;
        color: #333;
        height: 47px;
        transition: none;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #2d3a4b inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid #ccc;
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background: url("../../assets/images/bg.jpg") no-repeat center;
    background-size: cover;

    .login-form {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 380px;
      padding: 35px;
      background: #fff;
      border-radius: 5px;
      transform: translate(-50%, -50%);
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        margin: 0 auto 20px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .icon-container {
      display: inline-block;
      padding-left: 15px;
      font-size: 20px;

      i {
        vertical-align: middle;
      }
    }

    .login-btn {
      width: 100%;
      height: 40px;
    }
  }
</style>
