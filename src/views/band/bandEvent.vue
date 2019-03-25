<template>
  <div>
    <vue-event-calendar
        ref="calendarEvent"
        :events="demoEvents"
        @day-changed="handleDayChanged"
        @month-changed="handleMonthChanged"
    >
      <template>
        <div class="title-top">
          {{eventName}}
        </div>
        <div class="wrapper-event" v-if="eventItem.title && !eventItem.scheduleOfTheDay" style="text-align: center">
          当天无安排
          <!-- <div style="width: 100%; height: 50px; text-align: center; line-height: 50px">{{item.title}}</div> -->
        </div>
        <div class="wrapper-event" v-else v-for="(item, index) in eventItem.scheduleOfTheDay" :key="index">
        <el-row style="margin-bottom: 0;">
            <el-col :span="4">
            <img :src="item.scheduleImg" class="res-img">
            </el-col>
            <el-col :span="13" style="margin-top: 8px;">
            <p style="margin-bottom: 10px">乐队：{{bandInfo.bandName}}</p>
            <p style="margin-bottom: 10px">队长：{{item.captain}}</p>
            </el-col>
            <el-col :span="7">
            <!-- <button class="button">重复</button> -->
              <el-button type="primary" size="small" ref="perNone" v-show="item.performanceId && btnSee === true" @click="cacelConnect(item.scheduleId)">取消关联</el-button>
              <el-button type="primary" size="small" ref="perOk" v-show="!item.performanceId && btnSee === true" @click="connectPer(item.scheduleId)">关联新演出</el-button>
            </el-col>
        </el-row>
        <el-row style="margin-bottom: 0;">
            <el-col :span="20" style="float: right">
            <p style="margin-bottom: 10px;">行程内容：{{item.defaultContent}}</p>
            <p style="margin-bottom: 10px;">行程地点：{{item.scheduleAddress}}</p>
            <p>开始时间：{{item.scheduleStartTime}}</p>
            <p>结束时间：{{item.scheduleEndTime}}</p>
            </el-col>
        </el-row>
        <el-col :span="5" style="margin-left: 340px;margin-top: -35px;">
          <button class="button">{{item.scheduleStatus}}</button>
        </el-col>
        <div class="wrapper-event posLet" v-if="item.performanceId">
            <div class="title-bottom">演出详情</div>
            <p class="lineTo" v-if="item"><span>演出标题：{{item.performanceInfo.name}}</span></p>
            <p class="lineTo" v-if="item"><span>演出场馆：{{item.performanceInfo.address}}</span></p>
            <p class="lineTo" v-if="item"><span>开始时间：{{startTime(item.performanceInfo.startTime)}}</span></p>
            <p class="lineTo" v-if="item"><span>结束时间：{{endTime(item.performanceInfo.endTime)}}</span></p>
        </div>
        </div>
        <!-- <div class="wrapper-event">
          <div style="width: 100%; height: 50px; text-align: center; line-height: 50px">{{item.title}}</div>
        </div>
        <div class="wrapper-event posLet" v-if="eventItem[0].performanceId">
            <div class="title-bottom">演出详情</div>
            <p class="lineTo"><span>演出标题：{{performanceDetail.name}}</span></p>
            <p class="lineTo"><span>演出场馆：{{performanceDetail.address}}</span></p>
            <p class="lineTo"><span>开始时间：{{startTime}}</span></p>
            <p class="lineTo"><span>结束时间：{{endTime}}</span></p>
        </div> -->
      </template>
    </vue-event-calendar>
    <el-dialog el-dialog title="关联新演出" :visible.sync="dialogTableVisible">
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="演出标题">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.start_time|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间">
          <template slot-scope="scope">
            <span>{{scope.row.end_time|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="演出城市">
          <template slot-scope="scope">
            <span>{{scope.row.city_name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="演出地点">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="演出标签">
          <template slot-scope="scope">
            <span>{{scope.row.tagName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.timeStatus}}</span>
            <!-- <span>{{scope.row.state === 0 ? '上架' : '下架'}}</span> -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleChioce(scope.row)"
              type="primary">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </el-dialog>
  </div>
</template>

<script>
  import {scheduleDetail, relatedPerformances, delScheduleInfo} from 'server/status';
  import {getPerformanceList} from '../../server/content';
  import moment from 'moment';
  export default {
    props: {
      bandInfo: {
        type: Object
      }
    },
    data () {
      return {
        dataList: [],
        eventName: '',
        checkBand: true,
        dialogTableVisible: false,
        dayEventId: '',
        eventItem: {},
        demoEvents: [],
        list: [],
        performanceDetail: [],
        leftBtn: '',
        rightBtn: '',
        btnSee: true,
        allDate: []
      };
    },
    computed: {
      bandId () {
        return this.bandInfo.id;
      }
    },
    methods: {
      handleDayChanged (data) {
        // console.log('date-changed', data);
        this.eventName = data.date;
        // console.log(this.eventName);
        // console.log(this.demoEvents);
        this.demoEvents.forEach((item, index) => {
          if (item.date === this.eventName) {
            this.eventItem = item;
            console.log(this.eventItem);
            console.log(this.eventItem.scheduleOfTheDay);
            // this.allDate = this.eventItem.scheduleOfTheDay;
            console.log(this.allDate);
            // this.dayEventId = this.eventItem.id;
            // console.log(this.dayEventId);
            // if (this.eventItem[0].performanceId) {
            //   this._getPerformanceInfo();
            //   this.checkBand = false;
            // } else {
            //   this.checkBand = true;
            // }
            if (this.eventItem.scheduleOfTheDay) {
              this.eventItem.scheduleOfTheDay.forEach(item => {
                if (item.performanceId) {
                  // this._getPerformanceInfo();
                  this.checkBand = false;
                } else {
                  // this._getPerformanceInfo();
                  this.checkBand = true;
                }
              });
            }
          };
        });
        let allDom = document.getElementsByClassName('date-num');
        setTimeout(() => {
            for (let i = 0; i < allDom.length; i++) {
            allDom[i].style.color = '#000';
            }
        }, 20);
      },
      handleMonthChanged (data) {
        let leftBtn = document.getElementsByClassName('l')[0];
        let rightBtn = document.getElementsByClassName('r')[0];
        let title = document.getElementsByClassName('title')[0];
        console.log(title);
        let changeDate = data.substring(5, 7);
        let localDate = moment(new Date()).format('YYYY年MM月').substring(5, 7);
        console.log(localDate - changeDate);
        if (localDate > changeDate && localDate - changeDate === 1) {
          leftBtn.style.display = 'none';
          rightBtn.style.display = 'block';
          title.style.marginLeft = '100px';
          this.btnSee = false;
        } else if (localDate < changeDate && localDate - changeDate === -11) {
          leftBtn.style.display = 'none';
          rightBtn.style.display = 'block';
          title.style.marginLeft = '100px';
          this.btnSee = false;
        } else if (localDate === changeDate) {
          leftBtn.style.display = 'block';
          rightBtn.style.display = 'block';
          title.style.marginLeft = 0;
          this.btnSee = true;
        } else if (localDate < changeDate && localDate - changeDate === -1) {
          leftBtn.style.display = 'block';
          rightBtn.style.display = 'none';
          title.style.marginLeft = 0;
          this.btnSee = true;
        } else if (localDate > changeDate && localDate - changeDate === 11) {
          leftBtn.style.display = 'block';
          rightBtn.style.display = 'none';
          title.style.marginLeft = 0;
          this.btnSee = true;
        }
        console.log(data);
        let reg = /[\u4e00-\u9fa5]/g;
        let dataConfig = data.replace(reg, '') + '-' + '01';
        let dataEnd = dataConfig.slice(0, 4) + '-' + dataConfig.slice(4);
        this._scheduleDetail({
          id: this.bandId,
          type: 1,
          date: dataEnd
        });
      },
      _scheduleDetail (params) {
        scheduleDetail('/scheduleInfo/queryScheduleInfo', params).then(res => {
          if (res.code === 0) {
            this.demoEvents = res.data;
            let events = [];
            events = this.demoEvents.filter(event => {
              if (event.date === moment(new Date()).format('YYYY/M/D')) {
                return event;
              }
            });
            if (events.length !== 0) {
              this.eventItem = events[0];
              // console.log(this.eventItem);
              // this.dayEventId = this.eventItem.id;
              // console.log(this.dayEventId);
            }
            // this.allDate = this.eventItem.scheduleOfTheDay;
            // console.log(123);
            // this.eventItem.scheduleOfTheDay.forEach((item) => {
            //   if (item.performanceId) {
            //     // this._getPerformanceInfo();
            //     // console.log(123);
            //     this.checkBand = false;
            //   } else {
            //     this.checkBand = true;
            //   }
            // });
            let allDom = document.getElementsByClassName('date-num');
            setTimeout(() => {
              for (let i = 0; i < allDom.length; i++) {
                allDom[i].style.color = '#000';
              }
            }, 20);
          }
        });
      },
      // _getPerformanceInfo () {
      //   this.eventItem.scheduleOfTheDay.forEach((item, index) => {
      //     this.allDate = [];
      //     if (item.performanceId) {
      //       getPerformanceInfo('/performanceInfo/info', {
      //         id: item.performanceId
      //       }).then(res => {
      //         if (res.code === 0) {
      //           // this.eventItem.scheduleOfTheDay[index] = Object.assign(this.eventItem.scheduleOfTheDay[index], res.data.performanceInfo);
      //           // this.allDate = this.eventItem.scheduleOfTheDay;
      //           // this.allDate[index] = Object.assign(this.eventItem.scheduleOfTheDay[index], res.data.performanceInfo);
      //           this.allDate.push(Object.assign(this.eventItem.scheduleOfTheDay[index], res.data.performanceInfo));
      //           console.log(this.allDate);
      //         }
      //       });
      //     } else {
      //       this.allDate.push(item);
      //       console.log(123);
      //     }
      //   });
      //   // console.log(this.eventItem.scheduleOfTheDay);
      //   console.log(this.allDate);
      // },
      getPerformanceData(params) {
        getPerformanceList('performanceInfo/page', params).then(res => {
          if (res.code === 0) {
            console.log(res.data.records);
            this.list = res.data.records.filter(item => {
              return item.timeStatus !== '已结束';
            });
            console.log(this.list);
          }
        });
      },
      connectPer (id) {
        this.dialogTableVisible = true;
        this.dayEventId = id;
      },
      handleChioce (row) {
        relatedPerformances('/scheduleInfo/editScheduleInfo', {
          performanceId: row.id,
          id: this.dayEventId
        }).then(res => {
          if (res.code === 0) {
            this.dialogTableVisible = false;
            this.checkBand = false;
            this.$message.success('关联成功');
            console.log(this.eventName);
            this._scheduleDetail({
                id: this.bandId,
                type: 1,
                // date: moment(new Date()).format('YYYY-MM-DD')
                date: moment(this.eventName).format('YYYY-MM-DD') || moment(new Date()).format('YYYY-MM-DD')
            });
            // this._getPerformanceInfo();
          }
        });
      },
      cacelConnect (id) {
        delScheduleInfo('/scheduleInfo/delScheduleInfo', {
          id: id
        }).then(res => {
          if (res.code === 0) {
            this.$message.warning('取消关联成功');
            this.checkBand = true;
            this._scheduleDetail({
              id: this.bandId,
              type: 1,
              // date: moment(new Date()).format('YYYY-MM-DD')
              date: moment(this.eventName).format('YYYY-MM-DD') || moment(new Date()).format('YYYY-MM-DD')
            });
          }
        });
      },
      startTime (item) {
        return moment(item).format('YYYY-MM-DD HH:MM:SS');
      },
      endTime (item) {
        return moment(item).format('YYYY-MM-DD HH:MM:SS');
      }
    },
    activated () {
      this.getPerformanceData({
        current: 1,
        size: 10000
      });
    },
    mounted () {
      setTimeout(() => {
        this._scheduleDetail({
          id: this.bandId,
          type: 1,
          date: moment(new Date()).format('YYYY-MM-DD')
        });
        this.getPerformanceData({
          current: 1,
          size: 10000
        });
      }, 300);
      this.eventName = moment(new Date()).format('YYYY/M/D');
      // document.getElementsByClassName('events-wrapper')[0].style.backgroundColor = '#ffffff';
    }
  };
</script>

<style scoped lang="scss">
.el-row {
  padding: 0 20px;
  box-sizing: border-box;
}
.el-tabs__nav-scroll {
  height: 60px;
}
.title-top {
  width: 300px;
  height: 40px;
  line-height: 40px;
  position: absolute;
  left: 50%;
  margin-left: -150px;
  top: 50px;
  text-align: center;
  background-color: #409EFF;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 600;
  z-index: 999;
}
.title-bottom {
  width: 300px;
  height: 40px;
  line-height: 40px;
  position: relative;
  left: 50%;
  margin-left: -150px;
  top: 50%;
  text-align: center;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 600;
  color: #000;
  margin-bottom: 20px;
}
.wrapper-event {
  color: #000;
  border-radius: 6px;
  padding: 10px 0;
  box-sizing: border-box;
  margin-bottom: 10px;
  margin-top: 50px;
  border: 1px solid #000;
  .res-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .button{
    border: transparent;
    padding: 5px 10px;
    margin-right: 10px;
    border-radius: 10px;
    background-color: #409EFF;
    outline: none;
    font-size: 14px;
    letter-spacing: 2px;
    color: #ffffff;
  }
}
.lineTo {
  line-height: 1.5
}
.posLet {
  padding: 20px;
  width: 90%;
  margin-left: 5%;
}
</style>
<style>
/* .__vev_calendar-wrapper .cal-wrapper .cal-header .title{
  width:100%;
} */
/* .__vev_calendar-wrapper .cal-wrapper .cal-header .r{
  display: none
}
.__vev_calendar-wrapper .cal-wrapper .cal-header .l{
  display: none
} */
.__vev_calendar-wrapper .events-wrapper .date {
  display: none;
}
.__vev_calendar-wrapper .cal-wrapper .cal-body .dates .item .is-today {
  /* content: "";
  border: 1px solid #f29543;
  background-color: #fff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  margin-left: -18px;
  margin-top: -19px;
  color: #fff; */
  /* border: 1px solid #f29543; */
  background-color: #409EFF !important;
}
.__vev_calendar-wrapper .cal-wrapper .cal-body .dates .item .is-event {
  border: 0;
  color: #000 !important;
}
.__vev_calendar-wrapper .cal-wrapper .cal-body .dates .item.selected-day .is-event {
  background-color: #409EFF !important;
  color: #fff !important;
}
/* .__vev_calendar-wrapper .cal-wrapper .cal-header .title {
  position: relative;
  left: 50%;
  margin-left: -30%;
} */
</style>
