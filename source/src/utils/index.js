import { commonStatus,commonKinds } from '../constants/masterData';
import { STATUS_DELETE, } from '../constants';
import { showErrorMessage } from '../services/notifyService';

const Utils = {
    camelCaseToTitleCase(camelCase) {
        if (camelCase === null || camelCase === '') {
            return camelCase;
        }

        camelCase = camelCase.trim();
        var newText = '';
        for (var i = 0; i < camelCase.length; i++) {
            if (/[A-Z]/.test(camelCase[i])
                && i !== 0
                && /[a-z]/.test(camelCase[i-1])) {
                newText += ' ';
            }
            if (i === 0 && /[a-z]/.test(camelCase[i]))
            {
                newText += camelCase[i].toLowerCase();
            } else {
                newText += camelCase[i].toLowerCase();
            }
        }

        return newText;
    },
    getCommonStatusItem(status) {
        const allStatus = [
            ...commonStatus,
            { value: STATUS_DELETE, label: 'Xóa', color: 'red' }
        ]
        const statusItem = allStatus.find(item => item.value === status);
        return statusItem;
    },
    getCommonKindItem(kind) {
        const allKinds = [
            ...commonKinds,
            { value: 1, label: 'Tin tức' }
        ]
        const KindItem = allKinds.find(item => item.value === kind);
        return KindItem;
    },
    chunk(array, size) {
        const chunkedArr = [];
        let copied = [...array]; // ES6 destructuring
        const numOfChild = Math.ceil(copied.length / size); // Round up to the nearest integer
        for (let i = 0; i < numOfChild; i++) {
          chunkedArr.push(copied.splice(0, size));
        }
        return chunkedArr;
    },
    beforeUploadImage(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            showErrorMessage('Bạn chỉ có thể tải lên định dạng JPG/PNG!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            showErrorMessage('Hình phải nhỏ hơn 2MB!');
        }
        return isJpgOrPng && isLt2M;
    },
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    },
    isEmptyObject(obj) {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    },
    formatNumber(value){
        if(value) {
            const decimalPosition = value.toString().indexOf('.');
            if(decimalPosition > 0) {
                const intVal = value.toString().substring(0, decimalPosition);
                const decimalVal = value.toString().substring(decimalPosition + 1);
                return `${intVal.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimalVal}`;
            }
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        else if(value === 0)
            return 0;
        return '';
    },
    formatMoney(value, setting = {}){
        if((value || value === 0) && !isNaN(value)) {
            const groupSeparator = setting.groupSeparator || '.';
            const decimalSeparator = setting.decimalSeparator || ',';
            const currentcy = setting.currentcy || '€';
            //const currentcyPosition = setting.currentcyPosition || CurrentcyPositions.BACK;
            value = value.toFixed(2);
            const decimalPosition = value.toString().indexOf('.');
            if(decimalPosition > 0) {
                const intVal = value.toString().substring(0, decimalPosition);
                const decimalVal = value.toString().substring(decimalPosition + 1);
                value = `${intVal.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator)}${decimalSeparator}${decimalVal}`;
            }
            else {
                value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
            }
            return `${value} ${currentcy}`;
            // if(currentcyPosition === CurrentcyPositions.FRONT) {
            //     return `${currentcy} ${value}`;
            // }
            // else {
            //     return `${value} ${currentcy}`;
            // }
        }
        return '';
    },
    getFileNameFromPath(path) {
        if(path)
            return path.split('\\').pop().split('/').pop();
        return '';
    },
    parseJson(json) {
        let result = null;
        if(json) {
            try {
                result = JSON.parse(json);
            } catch(err) {
                console.error(err);
            }
        }
        return result;
    },
    convertStringToLowerCase(str) {
        if(str) {
            return str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map(x => x.toLowerCase())
            .join(' ')
        }
        return '';
    },
    removeAccents(str) {
        if(str)
            return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        return str;
    },
}

export default Utils;