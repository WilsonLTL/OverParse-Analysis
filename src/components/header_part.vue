<template>
    <v-toolbar dark fixed app clipped-right>
        <v-icon>fas fa-chart-bar</v-icon>
        <v-toolbar-title>
            <span class="title ml-3 mr-5">OverParse &nbsp;<span class="text">Analyser</span></span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon v-if="login_status === false"  v-on:click="readme = true">
            <v-icon>fab fa-readme</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
                <v-card-title class="primary">
                    <span class="headline white--text">{{cn_text_label.member_register_label}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container fluid grid-list-sm>
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12>
                                <v-img width="200" height="300" :src="reg_player_card.player_image" style="margin: auto;"></v-img>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field v-model="reg_player_card.player_name" :label="cn_text_label.player_name_label" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="reg_player_card.player_image" :label="cn_text_label.player_image_label" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="reg_player_card.player_password"  :label="cn_text_label.player_password_label" type="password" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="register_code"  :label="cn_text_label.register_code_label" type="password" required></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="dialog = false">{{cn_text_label.cancel}}</v-btn>
                    <v-btn color="blue darken-1" flat v-on:click="reg_new_player">{{cn_text_label.confirm}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog_clear" persistent width="300">
            <v-card>
                <v-card-title class="headline primary white--text"  primary-title>
                    {{reg_result}}
                </v-card-title>
                <v-card-text>
                    {{reg_access_token}}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="black" flat @click="dialog_clear = false">{{cn_text_label.confirm}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="readme" persistent max-width="500px">
            <v-card color="#262d47">
                <v-card-title>
                    <span class="headline white--text">User guideline</span>
                </v-card-title>
                <v-card-text>
                    <v-tabs dark centered color="#262d47" show-arrows>
                        <v-tabs-slider color="yellow"></v-tabs-slider>
                        <v-tab  href="#tab-1">
                            <v-icon class="white--text">fas fa-language</v-icon>
                            &nbsp English
                        </v-tab>
                        <v-tab href="#tab-2">
                            <v-icon class="white--text">mdi-translate</v-icon>
                            &nbsp 中文
                        </v-tab>
                        <v-tabs-items >
                            <v-tab-item :value="'tab-1'" >
                                <v-expansion-panel  popout>
                                    <v-expansion-panel-content class="white--text" style="background-color: #1b213b">
                                        <div slot="header"><v-icon class="white--text">fas fa-file-alt</v-icon>&nbsp Init New Record</div>
                                        <v-card class="white--text" style="background-color: #1b213b">
                                            <v-card-text>
                                                1. Press the &nbsp<v-icon class="white--text">fas fa-cog</v-icon>&nbsp, &nbsp<v-icon class="white--text">fas fa-upload</v-icon>&nbsp<br >
                                                2. Press the &nbsp<v-icon class="white--text">fas fa-play</v-icon>&nbsp when you start your mission. (Before you teleport) <br >
                                                3.1 Press the &nbsp<v-icon class="white--text">fas fa-stop</v-icon>&nbsp when you finish the mission. <br >
                                                3.2 Press the &nbsp<v-icon class="white--text">fas fa-mouse-pointer</v-icon>&nbsp to select the time by yourself <br >
                                                4. Select the latest .csv file in pso2_bin/damagelog. <br >
                                                5. Select your wanna language. <br >
                                                6. Enter your character name. <br >
                                                7. Send your request and wait. <br >
                                            </v-card-text>
                                        </v-card>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content class="white--text" style="background-color: #1b213b">
                                        <div slot="header"><v-icon class="white--text">fas fa-exchange-alt</v-icon>&nbsp Load Exist Record</div>
                                        <v-card class="white--text" style="background-color: #1b213b">
                                            <v-card-text>
                                                1. Press &nbsp<v-icon class="white--text">fas fa-cog</v-icon>&nbsp <br >
                                                2. Press &nbsp <v-icon class="white--text">fas fa-upload</v-icon> &nbsp, switch to &nbsp <v-icon class="white--text">fas fa-exchange-alt</v-icon>.<br >
                                                3. Enter the RecordID. <br >
                                                4. Send it and wait.
                                            </v-card-text>
                                        </v-card>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content class="white--text" style="background-color: #1b213b">
                                        <div slot="header"><v-icon class="white--text">fas fa-file</v-icon>&nbsp Recreate A New Record</div>
                                        <v-card class="white--text" style="background-color: #1b213b">
                                            <v-card-text>
                                                1. Press &nbsp<v-icon class="white--text">fas fa-cog</v-icon>&nbsp <br >
                                                2. Press &nbsp <v-icon class="white--text">fas fa-upload</v-icon> &nbsp,and do the same things with init. <br >
                                            </v-card-text>
                                        </v-card>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content class="white--text" style="background-color: #1b213b">
                                        <div slot="header"><v-icon class="white--text">fas fa-exchange-alt</v-icon>&nbsp Change The Target Player</div>
                                        <v-card class="white--text" style="background-color: #1b213b">
                                            <v-card-text>
                                                1. Press &nbsp<v-icon class="white--text">fas fa-cog</v-icon>&nbsp <br >
                                                2. Press <v-icon class="white--text">fas fa-tags</v-icon>.<br >
                                                3. Select your new target player. <br >
                                                4. Send it and wait.
                                            </v-card-text>
                                        </v-card>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content class="white--text" style="background-color: #1b213b">
                                        <div slot="header"><v-icon class="white--text">fas fa-share</v-icon>&nbsp Share your Record</div>
                                        <v-card class="white--text" style="background-color: #1b213b">
                                            <v-card-text>
                                                1. Press &nbsp<v-icon class="white--text">fas fa-cog</v-icon>&nbsp <br >
                                                2. Press <v-icon class="white--text">fas fa-share-alt</v-icon>. <br >
                                                3. Copy the record ID and share to your friends.
                                            </v-card-text>
                                        </v-card>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-tab-item>
                            <v-tab-item :value="'tab-2'" >
                                <v-expansion-panel  popout>
                                    <v-expansion-panel-content class="white--text" style="background-color: #1b213b">
                                        <div slot="header"><v-icon class="white--text">fas fa-file-alt</v-icon>&nbsp 初始化你的記錄</div>
                                        <v-card class="white--text" style="background-color: #1b213b">
                                            <v-card-text>
                                                1. 按下 &nbsp<v-icon class="white--text">fas fa-cog</v-icon>&nbsp, &nbsp<v-icon class="white--text">fas fa-upload</v-icon>&nbsp <br >
                                                2. 在你開始任務的時候按下 &nbsp<v-icon class="white--text">fas fa-play</v-icon>&nbsp . (在傳送之前) <br >
                                                3.1 在你完成任務的時候按下 &nbsp<v-icon class="white--text">fas fa-stop</v-icon>&nbsp . <br >
                                                3.2 你亦可以按下 &nbsp<v-icon class="white--text">fas fa-mouse-pointer</v-icon>&nbsp 自己選擇時間<br >
                                                4. 選擇最新的 .csv 檔案 (於pso2_bin/damagelog). <br >
                                                5. 選擇你的語言. <br >
                                                6. 輸入你的角色名稱. <br >
                                                7. 遞交並且等待. <br >
                                            </v-card-text>
                                        </v-card>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content class="white--text" style="background-color: #1b213b">
                                        <div slot="header"><v-icon class="white--text">fas fa-exchange-alt</v-icon>&nbsp 存取已存在的紀錄</div>
                                        <v-card class="white--text" style="background-color: #1b213b">
                                            <v-card-text>
                                                1. 按下 &nbsp<v-icon class="white--text">fas fa-cog</v-icon>&nbsp <br >
                                                2. 按下 &nbsp <v-icon class="white--text">fas fa-upload</v-icon> &nbsp, 切換至 &nbsp <v-icon class="white--text">fas fa-exchange-alt</v-icon>.<br >
                                                3. 輸入紀錄ID. <br >
                                                4. 遞交並且等待.
                                            </v-card-text>
                                        </v-card>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content class="white--text" style="background-color: #1b213b">
                                        <div slot="header"><v-icon class="white--text">fas fa-file</v-icon>&nbsp 重新建立新的紀錄</div>
                                        <v-card class="white--text" style="background-color: #1b213b">
                                            <v-card-text>
                                                1. 按下 &nbsp<v-icon class="white--text">fas fa-cog</v-icon>&nbsp <br >
                                                2. 按下 &nbsp <v-icon class="white--text">fas fa-upload</v-icon> &nbsp 重複初始化. <br >
                                            </v-card-text>
                                        </v-card>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content class="white--text" style="background-color: #1b213b">
                                        <div slot="header"><v-icon class="white--text">fas fa-exchange-alt</v-icon>&nbsp 改變你的目標角色</div>
                                        <v-card class="white--text" style="background-color: #1b213b">
                                            <v-card-text>
                                                1. 按下 &nbsp<v-icon class="white--text">fas fa-cog</v-icon>&nbsp <br >
                                                2. 按下 <v-icon class="white--text">fas fa-tags</v-icon>.<br >
                                                3. 選擇你的目標角色. <br >
                                                4. 遞交並且等待.
                                            </v-card-text>
                                        </v-card>
                                    </v-expansion-panel-content>
                                    <v-expansion-panel-content class="white--text" style="background-color: #1b213b">
                                        <div slot="header"><v-icon class="white--text">fas fa-share</v-icon>&nbsp 分享你的紀錄</div>
                                        <v-card class="white--text" style="background-color: #1b213b">
                                            <v-card-text>
                                                1. 按下 &nbsp<v-icon class="white--text">fas fa-cog</v-icon>&nbsp <br >
                                                2. 按下 <v-icon class="white--text">fas fa-share-alt</v-icon>. <br >
                                                3. 複製紀錄ID並且分享.
                                            </v-card-text>
                                        </v-card>
                                    </v-expansion-panel-content>
                                </v-expansion-panel>
                            </v-tab-item>
                        </v-tabs-items>

                    </v-tabs>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat v-on:click="readme = false">{{cn_text_label.confirm}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="user_manage_dialog" persistent max-width="500px">
            <v-card>
                <v-card-title class="primary">
                    <span class="headline white--text">{{cn_text_label.member_info_label}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container fluid grid-list-sm>
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12>
                                <v-img width="200" height="300" :src="player.avatar" style="margin: auto;"></v-img>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-text-field v-model="player.name" :label="cn_text_label.player_name_label" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="player.avatar" :label="cn_text_label.player_image_label" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="player.password"  :label="cn_text_label.player_password_label" type="password" required></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="user_manage_dialog = false">{{cn_text_label.cancel}}</v-btn>
                    <v-btn color="blue darken-1" flat v-on:click="update_player_info">{{cn_text_label.update}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-toolbar-side-icon @click.stop="drawerRight = !drawerRight"></v-toolbar-side-icon>
    </v-toolbar>
</template>

<script>
    import axios from 'axios'
    export default {
        data: ()=> ({
            // backend_url:"http://ec2-54-255-187-37.ap-southeast-1.compute.amazonaws.com:5000",
            // backend_url:"http://127.0.0.1:3000",
            dialog:false,
            readme:true,
            dialog_clear:false,
            reg_result:"註冊成功",
            reg_access_token:"",
            reg_player_card:{
                player_name:"",
                player_image:"",
                player_password:"",
                player_access_token:"PSO2-ARKS000"
            },
            player:{
                access_token:"",
                name:"",
                avatar:"",
                password:""
            },
            cn_text_label:{
                cancel:"取消",
                confirm:"確認",
                member_register_label:"會員註冊",
                member_login_label:"會員登入",
                member_info_label:"會員資料",
                player_name_label:"玩家暱稱",
                player_access_token_label:"玩家快速認證碼",
                player_image_label:"玩家頭像",
                player_password_label:"登入密碼",
                update:"更新",
                register_code_label:"註冊碼"
            },
            login_dialog:false,
            login_status:false,
            user_manage_dialog:false,
            register_code:""
        }),methods:{
            reg_new_player:function(){
                if (this.register_code === "a81ucksac"){
                    axios.post(this.backend_url+'/reg_new_player',this.reg_player_card).then((res) =>
                    {
                        this.dialog = false;
                        if (res.data["status"] === true){
                            this.reg_result = "註冊成功";
                            this.reg_access_token = `你的註冊成功,請記下以下快速認證以方便報名:\n`+ res.data["user_access_token"];
                        }else {
                            this.reg_result = "註冊失敗";
                            this.reg_access_token = "你的註冊由於不可抗力因素,失敗了,請再重新試一下(⋟﹏⋞)";
                        }
                    });
                    this.dialog_clear = true;
                }
            },user_login:function(){
                axios.post(this.backend_url+'/user_login',this.reg_player_card).then((res) =>
                {
                    this.login_dialog = false;
                    if(res.data["status"] === true){
                        this.login_status = true;
                        this.player.access_token = this.reg_player_card.player_access_token;
                        this.player.name = res.data["playercard"]["player_name"];
                        this.player.avatar = res.data["playercard"]["player_image"];
                        this.player.password = res.data["playercard"]["player_password"];
                        this.reg_result = "登入成功";
                        this.reg_access_token = "登入成功~~(≧∀≦)";
                    }else {
                        this.login_status = false;
                        this.reg_result = "登入失敗";
                        this.reg_access_token = "你的登入由於快速認證碼/密碼錯誤,失敗了,請再重新試一下(⋟﹏⋞)";
                    }
                    this.dialog_clear = true;
                });
            },update_player_info:function () {
                axios.post(this.backend_url+'/user_update',this.player).then((res) =>
                {
                    this.user_manage_dialog = false;
                    if(res.data["status"] === true){
                        this.login_status = true;
                        this.player.access_token = this.reg_player_card.player_access_token;
                        this.player.name = res.data["playercard"]["player_name"];
                        this.player.avatar = res.data["playercard"]["player_image"];
                        this.player.password = res.data["playercard"]["player_password"];
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>