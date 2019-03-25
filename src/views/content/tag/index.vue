<template>
  <div class="tag-manage">
    <div class="wrapper">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="音频标签" name="first">
          <tag-detail :musicTagDetail="musicTagDetail" @changeParent="changeParent"></tag-detail>
        </el-tab-pane>
        <el-tab-pane label="视频标签" name="second">
          <tag-detail :videoTagDetail="videoTagDetail" @changeParent="changeParent"></tag-detail>
        </el-tab-pane>
        <el-tab-pane label="演出标签" name="third">
          <tag-detail :perTagDetail="perTagDetail" @changeParent="changeParent"></tag-detail>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
 import tagDetail from './TagDetail';
//  import videoTagDetail from './videoTagDetail';
//  import perTagDetail from './perTagDetail';
 import {getTagList} from 'server/content';
  export default {
    name: 'Tag',
    data () {
      return {
        activeName: 'first',
        musicTagDetail: [],
        videoTagDetail: [],
        perTagDetail: []
      };
    },
    components: {
      tagDetail
      // videoTagDetail,
      // perTagDetail
    },
    methods: {
      handleClick(tab, event) {
      },
      _getTagList (params) {
        getTagList('/tagInfo/tagList', params).then(res => {
          if (res.code === 0) {
            if (params.tagType === 0) {
              this.musicTagDetail = res.data;
            } else if (params.tagType === 1) {
              this.videoTagDetail = res.data;
            } else if (params.tagType === 2) {
              this.perTagDetail = res.data;
            }
          }
        });
      },
      changeParent () {
        this._getTagList({
          tagType: 0
        });
        this._getTagList({
          tagType: 1
        });
        this._getTagList({
          tagType: 2
        });
      }
    },
    created () {
      this._getTagList({
        tagType: 0
      });
      this._getTagList({
        tagType: 1
      });
      this._getTagList({
        tagType: 2
      });
    }
  };
</script>

<style scoped>

</style>
