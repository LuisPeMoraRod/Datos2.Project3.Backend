class User {
    constructor(user_id, admin_status){
        this.user_id = user_id;
        this.admin_status = admin_status;
    }

    getUser(){
        var user = {
            user_id: this.user_id,
            admin_status: this.admin_status
        }
        return user;
    }
}