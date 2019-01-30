<template>
    <v-toolbar dark fixed app clipped-right>
        <v-icon>fas fa-chart-bar</v-icon>
        <v-toolbar-title>
            <span class="title ml-3 mr-5">OverParse &nbsp;<span class="text">Analyser</span></span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon v-if="login_status === false"  v-on:click="dialog = true">
            <v-icon>fab fa-wpforms</v-icon>
        </v-btn>
        <v-btn icon v-if="login_status === false" v-on:click="login_dialog = true">
            <v-icon>fas fa-user-alt</v-icon>
        </v-btn>
        <v-chip color="indigo darken-3" text-color="white" v-else v-on:click="user_manage_dialog = true">
            <v-avatar>
                <v-img :src="player.avatar" alt="trevor"></v-img>
            </v-avatar>
            {{player.name}}
        </v-chip>
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

        <v-dialog v-model="login_dialog" persistent max-width="500px">
            <v-card>
                <v-card-title class="primary">
                    <span class="headline white--text">{{cn_text_label.member_login_label}}</span>
                </v-card-title>
                <v-card-text>
                    <v-container fluid grid-list-sm>
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12>
                                <v-text-field v-model="reg_player_card.player_access_token" :label="cn_text_label.player_access_token_label" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="reg_player_card.player_password"  :label="cn_text_label.player_password_label" type="password" required></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="darken-1" flat @click="login_dialog = false">{{cn_text_label.cancel}}</v-btn>
                    <v-btn color="blue darken-1" flat v-on:click="user_login">{{cn_text_label.confirm}}</v-btn>
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
            backend_url:"http://ec2-54-255-187-37.ap-southeast-1.compute.amazonaws.com:5000",
            // backend_url:"http://127.0.0.1:3000",
            dialog:false,
            dialog_clear:false,
            reg_result:"註冊成功",
            reg_access_token:"",
            reg_player_card:{
                player_name:"",
                player_image:"http://hbimg.b0.upaiyun.com/64f61a9a25533284f8616c74eb76a7dc7f275616df3cb-PMcIkP_fw658",
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