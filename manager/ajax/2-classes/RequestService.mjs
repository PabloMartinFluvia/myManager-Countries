class HttpRequestService {

    #xmlHttpRequest;

    constructor() {
        this.#xmlHttpRequest = new XMLHttpRequest();
    }

    get(params, onOK) {
        this.#xmlHttpRequest.open("GET", encodeURI(`https://restcountries.com/v3.1/${params}`), true);
        this.#xmlHttpRequest.responseType = "json";
        this.#xmlHttpRequest.onload = () => {
            if (this.#xmlHttpRequest.status === 200) {     
                const response = this.#xmlHttpRequest.response.length === 1 ?
                           this.#xmlHttpRequest.response[0] :
                           this.#xmlHttpRequest.response;
                onOK(response);
            } else {
                alert("No hay conexión");
            }            
        }
        this.#xmlHttpRequest.send();
    }

    // TODO: delete get method

    get response() {
        return this.#xmlHttpRequest.response;
    }
}

export const httpRequest = new HttpRequestService();
