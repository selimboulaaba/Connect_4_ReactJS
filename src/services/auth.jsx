class Auth {

    header() {
        const token = localStorage.getItem('token');
        if (token) {
            return { Authorization: "Bearer " + token };
        } else {
            return {};
        }
    }

} export default new Auth();