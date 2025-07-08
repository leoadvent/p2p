export class StringUtil{
    static formatarMoedaReal(valor: string){
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    }
}