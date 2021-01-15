
const getIdFromResource = (jid) => {
    let s = jid.split('/');
    if (s.length < 2) return null;
    return s[0];
}

const getUserIdFromResource = (jid) => {
    let s = jid.split('/');
    if (s.length < 2) return null;
    return s[0].indexOf('@') < 0 ? null : s[0].split('@')[0];
}

module.exports = {
    getIdFromResource,getUserIdFromResource
}