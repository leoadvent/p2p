import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Platform, TouchableOpacity, View } from "react-native";
import uuid from 'react-native-uuid';
import BalaoTexto from '../components/balaoTexto';
import ButtonComponent from "../components/button";
import InputText from "../components/input";
import MeuSelect from '../components/picker';
import TextComponent from '../components/text/text';
import { flatListBorderColor, textColorPrimary } from '../constants/colorsPalette ';
import { FINANCIAMENTO, FINANCIAMENTO_PAGAMENTO, MODALIDADE, PERIODOCIDADE } from "../types/financiamento";
import { DataUtils } from '../utils/dataUtil';
import { StringUtil } from '../utils/stringUtil';
import BaseScreens from "./BaseScreens";

const Financiamento = () => {

    const [financiamento, setFinanciamento] = useState<FINANCIAMENTO>({} as FINANCIAMENTO)
    const [modalidade, setModalidade] = useState<MODALIDADE>(MODALIDADE.Parcelado)

    const [simulador, setSimulador] = useState<boolean>(true)

    const [showPickerDataInicio, setShowPickerDataInicio] = useState(false)
    const [showPickerDataFinal, setShowPickerDataFinal] = useState(false)

    const [dataInicio, setDataInicio] = useState(new Date())
    const [dataFinal, setDataFinal] = useState(() => {
        const hoje = new Date();
        const dataMais30Dias = new Date();
        dataMais30Dias.setDate(hoje.getDate() + 30);
        return dataMais30Dias;
    });
    const [valorFinanciamento, setValorFinanciamento] = useState<string>("")
    const [taxaJuros, setTaxaJuros] = useState<string>("")
    const [valorDiario, setValorDiario] = useState<string>("")
    const [taxaJurosAtraso, setTaxaJurosAtraso] = useState<string>("")
    const [adicionalDiaAtraso, setAdicionalDiaAtraso] = useState<string>("")
    const [totalParcelas, setTotalParcelas] = useState<string>("1")
    const [periodocidade, setPeriodocidade] = useState<string>("")
    const [valorParcela, setValorParcela] = useState<string>("")
    const [valorMontante, setValorMontante] = useState<string>("")
    const [quantidadeMeses, setQuantidadeMeses] = useState<number>(1)

    const [financiamentoPagament, setFinanciamentoPagamento] = useState<FINANCIAMENTO_PAGAMENTO[]>([])
    
    const route = useRoute();
    const { clientFinanciamento }: any = route.params ?? {}

    function handlerComporFinanciamento(){

        setFinanciamento({
            id: uuid.v4().toString(),
            dataInicio: dataInicio,
            dataFim: dataFinal,
            valorFinanciado: Number.parseFloat(valorFinanciamento.replaceAll('.','').replace(',','.')),
            taxaJuros: Number.parseFloat(taxaJuros.replace(',','.')),
            taxaJurosAtraso: Number.parseFloat(taxaJurosAtraso.replace(',','.').replace('%','')),
            adicionalDiaAtraso: Number.parseFloat(adicionalDiaAtraso.replace(',','.').replace('%','').replace('R$', '')),
            valorDiaria: Number.parseFloat(valorDiario.replace(',','.').replace('%','').replace('R$', '')),
            valorMontante: Number.parseFloat(valorMontante.replaceAll('.','').replace(',','.')),
            modalidade: modalidade,
            periodocidade: periodocidade === 'Mensal' ? PERIODOCIDADE.Mensal : periodocidade === 'Quinzenal' ? PERIODOCIDADE.Quinzenal : PERIODOCIDADE.Semanal,
            totalParcelas: Number.parseInt(totalParcelas),
            finalizado: false,
            atrasado: false,
            cliente: clientFinanciamento,
            pagamentos: financiamentoPagament
        })
    }

    function handlerMontarListaFinanciamentoPagamento() {
        if (!totalParcelas || !valorParcela || !valorDiario || !taxaJuros || !taxaJurosAtraso) {
            console.warn('Campos obrigatórios para gerar parcelas não estão preenchidos');
            return;
        }

        let inicio = new Date(dataInicio);
        const quantParcelas = parseInt(totalParcelas);
        const novaLista: FINANCIAMENTO_PAGAMENTO[] = [];

        const valorParcelaNumerico = parseFloat(
            valorParcela.replace(/[^0-9,]/g, '').replace(',', '.')
        );

        const valorDiarioNumerico = parseFloat(valorDiario.replace(/[^0-9,]/g, '').replace(',', '.'));
        const taxaJurosNumerico = parseFloat(taxaJuros.replace('%', '').replace(',', '.'));
        const taxaJurosAtrasoNumerico = parseFloat(taxaJurosAtraso.replace('%', '').replace(',', '.'));

        for (let i = 1; i <= quantParcelas; i++) {
            novaLista.push({
                cliente: clientFinanciamento,
                id: uuid.v4().toString(),
                dataVencimento: new Date(inicio),
                dataPagamento: null,
                numeroParcela: i,
                valorPago: 0,
                valorAtual: valorParcelaNumerico,
                valorDiaria: valorDiarioNumerico,
                juros: taxaJurosNumerico,
                jurosAtraso: taxaJurosAtrasoNumerico,
                executadoEmpenho: false
            });

            // Avança a data conforme periodicidade
            if (periodocidade === PERIODOCIDADE.Mensal) {
                inicio.setMonth(inicio.getMonth() + 1);
            } else if (periodocidade === PERIODOCIDADE.Quinzenal) {
                inicio.setDate(inicio.getDate() + 15);
            } else if (periodocidade === PERIODOCIDADE.Semanal) {
                inicio.setDate(inicio.getDate() + 7);
            }
        }
        setFinanciamentoPagamento(novaLista);
        handlerComporFinanciamento();
    }



    function calculaQuantidadeDeParcela() {
        if (!dataInicio || !dataFinal || !periodocidade) return;

        const inicio = new Date(dataInicio);
        const fim = new Date(dataFinal);

        if (fim <= inicio) {
            setTotalParcelas('0');
            return;
        }

        const diffEmMilissegundos = fim.getTime() - inicio.getTime();
        const diffEmDias = diffEmMilissegundos / (1000 * 60 * 60 * 24);

        let total = 0;

        setQuantidadeMeses(Math.ceil(diffEmDias / 30))

        switch (periodocidade.toLowerCase()) {
            case 'mensal':
                total = Math.ceil(diffEmDias / 30);
                break;
            case 'quinzenal':
                total = Math.ceil(diffEmDias / 15);
                break;
            case 'semanal':
                total = Math.ceil(diffEmDias / 7);
                break;
            default:
                total = 0;
        }

        
        setTotalParcelas(total.toString());
    }

    function calcularMontante(){
         // Normaliza valores
        const valorNormalizado = valorFinanciamento.replace(/\./g, '').replace(',', '.');
        const taxaNormalizada = taxaJuros.replace(/\./g, '').replace(',', '.').replace('%', '');

        const numValor = parseFloat(valorNormalizado);
        const numTaxa = parseFloat(taxaNormalizada);

        const jurosTotal = (numValor * numTaxa) / 100;

        const valorMontante = numValor + jurosTotal;

        setValorMontante(valorMontante.toString());
    }

    function calcularJurosDiario() {
        if (!valorFinanciamento || !taxaJuros || !totalParcelas) return;

        // Normaliza valores
        const valorNormalizado = valorFinanciamento.replace(/\./g, '').replace(',', '.');
        const taxaNormalizada = taxaJuros.replace(/\./g, '').replace(',', '.').replace('%', '');

        const numValor = parseFloat(valorNormalizado);
        const numTaxa = parseFloat(taxaNormalizada);
        const numParcelas = parseInt(totalParcelas);

        if (isNaN(numValor) || isNaN(numTaxa) || isNaN(numParcelas) || numParcelas <= 0) {
            setValorDiario("Valor inválido");
            setValorMontante("0");
            setValorParcela("0");
            return;
        }

        // Juros diário
        const jurosTotal = (numValor * numTaxa) / 100;

        // Montante com juros simples
        const valorMontante = numValor + jurosTotal;

        const valDiario = (valorMontante / quantidadeMeses) / 30;

        

        const valorParcela = valorMontante / numParcelas;

        const formatar = (valor: number) =>
            new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2
            }).format(valor);

        setTaxaJurosAtraso(taxaJuros);
        setValorDiario(formatar(valDiario));
        setAdicionalDiaAtraso(formatar(valDiario));
        setValorMontante(formatar(valorMontante));
        setValorParcela(valorParcela.toString()); // apenas formata no input no render

        calcularMontante()
    }


    useEffect(() => {calcularJurosDiario()}, [taxaJuros, valorFinanciamento, totalParcelas])

    useEffect(() => {calculaQuantidadeDeParcela()}, [periodocidade, dataInicio, dataFinal])


    return(
        <BaseScreens title={`FINANCIAMENTO`} rolbackStack={true}>
            
            <View style={{ gap: 20, display: simulador ?'flex' : 'none', flexDirection:'column', height:'100%', justifyContent:"space-between" }}>
                
                <View style={{ width:330, display:"flex", flexDirection:"row", flexWrap:"wrap", gap: 20, justifyContent: "center", alignItems: "center" }}>
                
                    <InputText 
                        width={330}
                        label={"Cliente *"} 
                        editable={false} 
                        value={`${clientFinanciamento.firstName} ${clientFinanciamento.lastName}`}
                    />


                    <ButtonComponent nameButton={`TIPO: ${modalidade}`} onPress={() => {setModalidade(modalidade === MODALIDADE.Parcelado ? MODALIDADE.CarenciaDeCapital : MODALIDADE.Parcelado)} } typeButton={"primary"} width={330} />

                    <MeuSelect
                        inputError={false}
                        label='Periodicidade *'
                        width={335}
                        selecionado={setPeriodocidade}
                        options={
                            [
                                {label:PERIODOCIDADE.Quinzenal, value:PERIODOCIDADE.Quinzenal, default:false},
                                {label:PERIODOCIDADE.Semanal,   value:PERIODOCIDADE.Semanal, default:false},
                                {label:PERIODOCIDADE.Mensal,    value:PERIODOCIDADE.Mensal, default:true}
                            ]
                        }                    
                    />

                
                    
                    <TouchableOpacity
                        onPress={() => setShowPickerDataInicio(true)}
                    >
                        <InputText 
                            label="Data Início"
                            editable={false}
                            width={150}
                            value={dataInicio.toLocaleDateString('pt-BR')}
                        />
                    </TouchableOpacity>

                    {showPickerDataInicio && (
                        <DateTimePicker
                            value={dataInicio}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowPickerDataInicio(false)
                                if (selectedDate) setDataInicio(selectedDate)
                            }}
                        />
                    )}

                    <TouchableOpacity
                        onPress={() => setShowPickerDataFinal(true)}
                    >
                        <InputText 
                            label="Data Final"
                            editable={false}
                            width={150}
                            value={dataFinal.toLocaleDateString('pt-BR')}
                        />
                    </TouchableOpacity>

                    {showPickerDataFinal && (
                        <DateTimePicker
                            value={dataFinal}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={(event, selectedDate) => {
                                setShowPickerDataFinal(false)
                                if (selectedDate) setDataFinal(selectedDate)
                            }}
                        />
                    )}
                

                    <InputText 
                            editable
                            label="Valor *" 
                            money={true}
                            keyboardType="numeric"
                            value={valorFinanciamento}
                            width={150}
                            onChangeText={(text) => {setValorFinanciamento(text)}}
                            placeholder="Valor Financiado"
                        />

                        <InputText 
                            editable
                            label="Juros Empréstimo *" 
                            keyboardType="numeric"
                            value={taxaJuros}
                            width={150}
                            percentage
                            onChangeText={(text) => { setTaxaJuros(text)}}
                            placeholder="Juros"
                        />

                        {modalidade === MODALIDADE.Parcelado && 
                            <>
                                <InputText 
                                    editable
                                    label="Juros Atraso *" 
                                    placeholder='Juros Atraso'
                                    keyboardType="numeric"
                                    value={taxaJurosAtraso}
                                    width={150}
                                    percentage
                                    onChangeText={(text) => {setTaxaJurosAtraso(text)}}
                                />

                                <InputText 
                                    editable
                                    label="Adicional Por Dia Atraso *" 
                                    placeholder='Adicional Atraso'
                                    money
                                    keyboardType="numeric"
                                    value={adicionalDiaAtraso}
                                    width={150}
                                    onChangeText={(text) => { setAdicionalDiaAtraso(text)}}
                                />

                                <InputText 
                                    editable={false}
                                    label="Quantidade Parcelas *" 
                                    keyboardType="numeric"
                                    value={totalParcelas}
                                    width={150}
                                    onChangeText={(text) => { setTotalParcelas(text)}}
                                />

                                <InputText 
                                    editable={false}
                                    label="Valor Parcelas *" 
                                    keyboardType="numeric"
                                    money={true}
                                    value={Number(valorParcela).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    width={150}
                                    onChangeText={(text) => { setValorParcela(text)}}
                                />
                            </>
                        }

                        {modalidade === MODALIDADE.CarenciaDeCapital &&
                            <InputText 
                                editable={false}
                                label="Valor Diário *" 
                                placeholder='Valor Diário'
                                money
                                keyboardType="numeric"
                                value={valorDiario}
                                width={150}
                                onChangeText={(text) => { setValorDiario(text)}}
                            />
                        }

                    
                </View>
            
                <ButtonComponent nameButton={'SIMULAR'} onPress={() => {setSimulador(!simulador); handlerMontarListaFinanciamentoPagamento()}} typeButton={'primary'} width={335} />
            </View>
            
            {Object.entries(financiamento).length > 0 && 
                <View style={{ gap: 20, display: !simulador ?'flex' : 'none', flexDirection:'column', height:'100%', width:335, justifyContent:"space-between",  alignItems: "center" }}>
                    
                    <View style={{ display:"flex", flexDirection:"row", flexWrap:"wrap", gap: 10,  width:335, justifyContent: "space-between", alignItems: "center", alignContent:"center" }}>
                        <BalaoTexto 
                            children={<TextComponent text={`Contrato: ${financiamento.id.substring(0, financiamento.id.indexOf('-'))}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />} />

                        <BalaoTexto 
                            children={<TextComponent text={`${financiamento.cliente.firstName} ${financiamento.cliente.lastName}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />} />
                     
                        <BalaoTexto 
                            children={<TextComponent text={`Inicio: ${DataUtils.formatarDataBR(financiamento.dataInicio)}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />} />
                        
                        <BalaoTexto 
                            children={<TextComponent text={`Fim: ${DataUtils.formatarDataBR(financiamento.dataFim)}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />} />
                    
                        <BalaoTexto 
                            children={<TextComponent text={`Taxa Juros: ${financiamento.taxaJuros}%`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />} />
                        
                        <BalaoTexto 
                            children={<TextComponent text={`Taxa atraso: ${financiamento.taxaJurosAtraso}%`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />} />
                        
                        <BalaoTexto 
                            children={<TextComponent text={`Tipo: ${financiamento.modalidade}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />}
                        />

                        <BalaoTexto 
                            children={<TextComponent text={`Valor: ${StringUtil.formatarMoedaReal(financiamento.valorFinanciado.toString())}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />} />
                        
                        <BalaoTexto 
                            children={<TextComponent text={`Montante: ${StringUtil.formatarMoedaReal(financiamento.valorMontante.toString())}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />} />
                        
                        <BalaoTexto 
                            children={<TextComponent text={`Diária: ${StringUtil.formatarMoedaReal(financiamento.valorDiaria.toString())}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />} />
                        
                        <BalaoTexto 
                            children={<TextComponent text={`Adicional Atraso: ${StringUtil.formatarMoedaReal(financiamento.adicionalDiaAtraso.toString())}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />} />
                        
                                            
                        
                    </View>

                    <View style={{ height: 190}}>
                        <BalaoTexto 
                            children={<TextComponent text={`Total de Parcelas: ${financiamento.totalParcelas}`} color={textColorPrimary} fontSize={14} textAlign={'center'} />} />  
                        <FlatList 
                            data={financiamentoPagament} 
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={{ 
                                    display: "flex",
                                    flexDirection: 'row',
                                    width: 300, 
                                    justifyContent:"space-between",
                                    borderWidth: 1, 
                                    marginBottom: 10,
                                    borderBottomColor: flatListBorderColor,
                                    borderRadius: 15,
                                    padding: 10,
                                }}>
                                        <TextComponent text={`${item.numeroParcela}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />
                                        <TextComponent text={`${DataUtils.formatarDataBR(item.dataVencimento)}`} color={textColorPrimary} fontSize={14}  textAlign='auto' />
                                        <TextComponent
                                            text={item.valorAtual.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                            })}
                                            textAlign='auto'
                                            color={textColorPrimary}
                                            fontSize={16}
                                        />
                                    </View>
                            ) }               
                        />
                    </View>
                    <ButtonComponent nameButton={'EDITAR'} onPress={() => {setSimulador(!simulador)}} typeButton={'warning'} width={335} />
                    <ButtonComponent nameButton={'FINANCIAR'} onPress={() => {}} typeButton={'success'} width={335} />
                </View>
            }

        </BaseScreens>
    )
}

export default Financiamento