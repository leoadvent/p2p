export class DataUtils {
  static formatarDataBR(data:  string | Date): string {
    
    const dataObj = typeof data === 'string' ? new Date(data) : data;

    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }
}
