export class DataUtils {
  static formatarDataBR(data:  string | Date): string {
    
    const dataObj = typeof data === 'string' ? new Date(data) : data;

    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  static calcularDiasEntreDatas(dataInicial: Date, dataFinal: Date): number {
    const umDiaEmMs = 1000 * 60 * 60 * 24; // milissegundos em um dia

    const dataObj = typeof dataInicial === 'string' ? new Date(dataInicial) : dataInicial;


    // Zerar a hora das datas para comparar apenas o dia
    const inicio = new Date(dataObj.getFullYear(), dataObj.getMonth(), dataObj.getDate());
    const fim = new Date(dataFinal.getFullYear(), dataFinal.getMonth(), dataFinal.getDate());

    const diferencaEmMs = fim.getTime() - inicio.getTime();

    const quantidade =  Math.floor(diferencaEmMs / umDiaEmMs);
    return quantidade < 0 ? 0 : quantidade;
  }
}
