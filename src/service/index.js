import StanzaService from './StanzaService';

class Main {
    config(params) {
        this.client = new StanzaService(params.username, params.password);
    }
}

const main = new Main();

export default main