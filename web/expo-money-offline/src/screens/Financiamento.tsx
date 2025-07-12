import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Platform, TouchableOpacity, View } from "react-native";
import uuid from 'react-native-uuid';
import BalaoTexto from '../components/balaoTexto';
import ButtonComponent from "../components/button";
import InputText from "../components/input";
import ModalSystem from '../components/modal';
import MeuSelect from '../components/picker';
import TextComponent from '../components/text/text';
import { backgroundOpacityBallon, flatListBorderColor, iconColorPrimary, textColorPrimary } from '../constants/colorsPalette ';
import { useFinanciamentoDataBase } from '../database/useFinanciamentoDataBase';
import { FINANCIAMENTO, FINANCIAMENTO_PAGAMENTO, MODALIDADE, PERIODOCIDADE } from "../types/financiamento";
import { DataUtils } from '../utils/dataUtil';
import { IconsUtil } from '../utils/iconsUtil';
import { StringUtil } from '../utils/stringUtil';
import BaseScreens from "./BaseScreens";

const Financiamento = () => {

    const [financiamento, setFinanciamento] = useState<FINANCIAMENTO>({} as FINANCIAMENTO)
    const [modalidade, setModalidade] = useState<MODALIDADE>(MODALIDADE.Parcelado)

    const [simulador, setSimulador] = useState<boolean>(true)

    const [showPickerDataInicio, setShowPickerDataInicio] = useState(false)
    const [showPickerDataFinal, setShowPickerDataFinal] = useState(false)

    const [dataInicio, setDataInicio] = useState(() => {
        const hoje = new Date();
        const dataMais30Dias = new Date();
        dataMais30Dias.setDate(hoje.getDate() + 30);
        return dataMais30Dias;
    });
    const [dataFinal, setDataFinal] = useState(() => {
        const hoje = new Date();
        const dataMais60Dias = new Date();
        dataMais60Dias.setDate(hoje.getDate() + 60);
        return dataMais60Dias;
    });
    const [valorFinanciamento, setValorFinanciamento] = useState<string>("")
    const [taxaJuros, setTaxaJuros] = useState<string>("")
    const [valorDiario, setValorDiario] = useState<string>("")
    const [taxaJurosAtraso, setTaxaJurosAtraso] = useState<string>("")
    const [adicionalDiaAtraso, setAdicionalDiaAtraso] = useState<string>("")
    const [totalParcelas, setTotalParcelas] = useState<string>("1")
    const [periodocidade, setPeriodocidade] = useState<string>(PERIODOCIDADE.Mensal)
    const [valorParcela, setValorParcela] = useState<string>("")
    const [valorMontante, setValorMontante] = useState<string>("")
    const [quantidadeMeses, setQuantidadeMeses] = useState<number>(1)

    const [financiamentoPagament, setFinanciamentoPagamento] = useState<FINANCIAMENTO_PAGAMENTO[]>([])

    const [financiamentoFinalizado, setFinanciamentoFinalizado] = useState<boolean>(false);
    const [modalShow, setModalShow] = useState<boolean>(false);
    const [titleModal, setTitleModal] = useState<string>("")
    const route = useRoute();
    const { clientFinanciamento }: any = route.params ?? {}

    const financiamentoDataBase = useFinanciamentoDataBase();

    function handlerSalvarFinanciamento(){
        financiamentoDataBase.create(financiamento).then((response) => {
            setFinanciamentoFinalizado(true)
            setModalShow(true);
            setTitleModal('FINANCIAMENTO CRIADO')
        }).catch((error) => {
            setTitleModal('ERROR CRIAR FINANCIAMENTO')
            alert(error)
            setModalShow(true)
        })
    }

    function handlerComporFinanciamento(financiamentoPagamento: FINANCIAMENTO_PAGAMENTO[]){

        setFinanciamento({
            id: uuid.v4().toString(),
            dataInicio: dataInicio,
            dataFim: dataFinal,
            valorFinanciado: Number.parseFloat(valorFinanciamento.replaceAll('.','').replace(',','.')),
            taxaJuros: Number.parseFloat(taxaJuros.replace(',','.')),
            taxaJurosAtraso: Number.parseFloat(taxaJurosAtraso.replace(',','.').replace('%','')),
            adicionalDiaAtraso: Number.parseFloat(adicionalDiaAtraso.replace(',','.').replace('%','').replace('R$', '')),
            valorDiaria: Number.parseFloat(valorDiario.replace(',','.').replace('%','').replace('R$', '')),
            valorMontante: Number.parseFloat(valorMontante.replaceAll('.','').replace(',','.').replace('R$', '')),
            valorPago: 0,
            modalidade: modalidade,
            periodocidade: periodocidade === 'Mensal' ? PERIODOCIDADE.Mensal : periodocidade === 'Quinzenal' ? PERIODOCIDADE.Quinzenal : PERIODOCIDADE.Semanal,
            totalParcelas: Number.parseInt(totalParcelas),
            finalizado: false,
            atrasado: false,
            cliente: clientFinanciamento,
            pagamentos: financiamentoPagamento
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

        const valorDiarioNumerico = parseFloat(valorDiario.replace(/[^0-9,]/g, '').replace(',', '.'));
        const taxaJurosNumerico = parseFloat(taxaJuros.replace('%', '').replace(',', '.'));
        const taxaJurosAtrasoNumerico = parseFloat(taxaJurosAtraso.replace('%', '').replace(',', '.'));

        let quant = modalidade === MODALIDADE.CarenciaDeCapital ? 1 : quantParcelas
        let valParcel = modalidade === MODALIDADE.CarenciaDeCapital 
            ? Number(valorDiario.replaceAll('.','').replace(',','.').replace('R$',''))
            : valorParcela

        const dataUltimoPagamento = new Date();
        const novaDataUltimoPagamento = new Date(dataUltimoPagamento);
        novaDataUltimoPagamento.setDate(novaDataUltimoPagamento.getDate() - 1); 

        for (let i = 1; i <= quant; i++) {
            novaLista.push({
                cliente: clientFinanciamento,
                id: uuid.v4().toString(),
                dataVencimento: new Date(inicio),
                dataPagamento: null,
                dataUltimoPagamento: novaDataUltimoPagamento,
                numeroParcela: i,
                valorPago: 0,
                valorAtual: Number.parseFloat(valParcel.toString()),
                valorParcela: modalidade === MODALIDADE.Parcelado ? Number.parseFloat(valParcel.toString()) :  Number.parseFloat(valorFinanciamento.replaceAll('.','').replace(',','.')) ,
                valorDiaria: valorDiarioNumerico,
                modalidade: modalidade,
                juros: taxaJurosNumerico,
                jurosAtraso: taxaJurosAtrasoNumerico,
                executadoEmpenho: false,
                pagamentoRealizado: false,
                renegociado: false,
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
        handlerComporFinanciamento(novaLista);
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

        const valorMontante = modalidade === MODALIDADE.CarenciaDeCapital ? numValor + numValor : numValor + jurosTotal;

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

        const jurosTotal = (numValor * numTaxa) / 100;

        const valorMontante = modalidade === MODALIDADE.CarenciaDeCapital ? numValor + numValor : numValor + jurosTotal;

        const valDiario = jurosTotal / 30;

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
        setValorParcela(modalidade === MODALIDADE.CarenciaDeCapital ? (valDiario * 30).toString() : valorParcela.toString()); // apenas formata no input no render

        calcularMontante()
    }

    function resumoFinanciamento(){
        return(
                    <View style={{ display:"flex", flexDirection:"row", flexWrap:"wrap", gap: 0,  width:335, justifyContent: "space-between", alignItems: "center", alignContent:"center" }}>
                        <BalaoTexto 
                            borderWidth={0}
                            children={
                                <View style={{ flexDirection:"row", width:140, alignItems:"center", gap:5}}>
                                    {IconsUtil.contrato({size: 15, color: iconColorPrimary})}
                                    <TextComponent text={`Contrato: ${financiamento.id.substring(0, financiamento.id.indexOf('-'))}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />
                                </View>
                                }
                            backgroundColor='transparent'
                        />

                        <BalaoTexto 
                            borderWidth={0}
                            children={
                                <View style={{ flexDirection:"row", width:140, alignItems:"center", gap:5}}>
                                    {IconsUtil.modalidade({size: 15, color: iconColorPrimary})}
                                    <TextComponent text={`${financiamento.modalidade}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />
                                </View>
                                } 
                            backgroundColor='transparent'
                        />

                        <BalaoTexto 
                            borderWidth={0}
                            children={
                                <View style={{ flexDirection:"row", width:140, alignItems:"center", gap:5}}>
                                    {IconsUtil.cliente({size: 15, color: iconColorPrimary})}
                                    <TextComponent text={`${financiamento.cliente.firstName} ${financiamento.cliente.lastName}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />
                                </View>
                                } 
                            backgroundColor='transparent'
                        />
                     
                        <BalaoTexto
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"row", width:140, alignItems:"center", gap:5}}>
                                    {IconsUtil.calendarioNumero({size: 15, color: iconColorPrimary})}
                                    <TextComponent text={`Inicio: ${DataUtils.formatarDataBR(financiamento.dataInicio)}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />
                                </View>
                                } 
                            backgroundColor='transparent'
                        />
                        
                        <BalaoTexto
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"row", width:140, alignItems:"center", gap:5}}>
                                    {IconsUtil.calendarioNumero({size: 15, color: iconColorPrimary})}
                                    <TextComponent text={`Fim: ${DataUtils.formatarDataBR(financiamento.dataFim)}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />
                                </View>
                                }
                            backgroundColor='transparent'
                        />
                    
                        {modalidade === MODALIDADE.Parcelado &&
                            <BalaoTexto
                                borderWidth={0} 
                                children={
                                    <View style={{ flexDirection:"row", width:140, alignItems:"center", gap:5}}>
                                        {IconsUtil.iconTaxa({ size: 15, color: iconColorPrimary })}
                                        <TextComponent text={`Taxa Juros: ${financiamento.taxaJuros}%`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />
                                    </View>    
                                    }
                                backgroundColor='transparent'
                            />
                        }
                        
                        {modalidade === MODALIDADE.Parcelado &&
                            <BalaoTexto
                                borderWidth={0} 
                                children={
                                    <View style={{ flexDirection:"row", width:140, alignItems:"center", gap:5}}>
                                        {IconsUtil.iconTaxa({ size: 15, color: iconColorPrimary })}
                                        <TextComponent text={`Taxa atraso: ${financiamento.taxaJurosAtraso}%`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />
                                    </View>}
                                backgroundColor='transparent'
                            />
                        }

                        <BalaoTexto
                            borderWidth={0} 
                            children={
                                <View style={{ flexDirection:"row", width:130, alignItems:"center", gap:5}}>
                                    {IconsUtil.dinheiro({ size: 15, color: iconColorPrimary })}    
                                    <TextComponent text={`Valor: ${StringUtil.formatarMoedaReal(financiamento.valorFinanciado.toString())}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />
                                </View>        
                                }
                            backgroundColor='transparent'
                        />
                        
                        <BalaoTexto
                            borderWidth={0} 
                            children={<TextComponent text={`Montante: ${StringUtil.formatarMoedaReal(financiamento.valorMontante.toString())}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />}
                            backgroundColor='transparent'
                        />
                        
                        {modalidade === MODALIDADE.CarenciaDeCapital &&
                            <BalaoTexto
                                borderWidth={0} 
                                children={<TextComponent text={`Diária: ${StringUtil.formatarMoedaReal(financiamento.valorDiaria.toString())}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />}
                                backgroundColor='transparent'
                            />
                        }
                        
                        {modalidade === MODALIDADE.Parcelado && 
                            <BalaoTexto
                                borderWidth={0} 
                                children={<TextComponent text={`Adicional Atraso: ${StringUtil.formatarMoedaReal(financiamento.adicionalDiaAtraso.toString())} diários`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />}
                                backgroundColor='transparent'
                            />
                        }
                        
                    </View>
        )
    }

    useEffect(() => {calcularJurosDiario()}, [taxaJuros, valorFinanciamento, totalParcelas, modalidade])

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
                <View style={{ gap: 10, display: !simulador ?'flex' : 'none', flexDirection:'column', height:'100%', width:335, justifyContent:"space-between",  alignItems: "center" }}>
                    
                    
                    {resumoFinanciamento()}

                    <View style={{ height: 280, width:330}}>
                        <BalaoTexto 
                            borderWidth={0}
                            backgroundColor={backgroundOpacityBallon}
                            children={
                                <>
                                    {modalidade === MODALIDADE.Parcelado && <TextComponent text={`Total de Parcelas: ${financiamento.totalParcelas} de ${StringUtil.formatarMoedaReal(valorParcela)}`} color={textColorPrimary} fontSize={14} textAlign={'center'} />}
                                    {modalidade === MODALIDADE.CarenciaDeCapital && <TextComponent text={`Diarias de ${valorDiario} + 1 de ${StringUtil.formatarMoedaReal(valorFinanciamento.replaceAll('.','').replace(',','.'))}`} color={textColorPrimary} fontSize={12} textAlign={'center'} />}
                                    <TextComponent text={`Modalidade:  ${financiamento.modalidade}`} color={textColorPrimary} fontSize={14} textAlign={'center'} />
                                    <TextComponent text={`Periodicidade: ${financiamento.periodocidade}`} color={textColorPrimary} fontSize={14} textAlign={'center'} />
                                </>
                            } />  
                        <FlatList 
                            data={financiamentoPagament} 
                            keyExtractor={(item) => item.id}
                            scrollEnabled={true}
                            renderItem={({ item }) => (
                                <View
                                    style={{ 
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: 0,
                                        padding: 10, 
                                        width: 330,
                                        marginBottom:10,
                                        borderWidth: 1,
                                        borderBottomColor: flatListBorderColor,
                                        borderRadius: 5
                                    }}
                                >
                                    <View style={{ display: 'flex', flexDirection: 'row', gap:5, alignItems:'center', width:110}}>
                                        <Ionicons name='return-down-forward-outline' size={25} color={iconColorPrimary}/>
                                        <TextComponent text={`Parcela ${item.numeroParcela}`} color={textColorPrimary} fontSize={14} textAlign={'auto'} />
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', gap:5, alignItems:'center',  width:130}}>
                                        <Ionicons name='calendar-number-outline' size={20} color={iconColorPrimary}/>
                                        <TextComponent text={`${DataUtils.formatarDataBR(item.dataVencimento)}`} color={textColorPrimary} fontSize={14}  textAlign='auto' />
                                    </View>
                                    <View style={{ display: 'flex', flexDirection: 'row', gap:5, alignItems:'center'}}>
                                        <TextComponent text={`${StringUtil.formatarMoedaReal(item.valorAtual.toString())}`} color={textColorPrimary} fontSize={14}  textAlign='auto' />
                                    </View>
                                </View>
                            ) }               
                        />
                    </View>
                    <ButtonComponent nameButton={'EDITAR'} isDisabled={financiamentoFinalizado} onPress={() => {setSimulador(!simulador)}} typeButton={'warning'} width={335} />
                    <ButtonComponent nameButton={'FINANCIAR'} isDisabled={financiamentoFinalizado} onPress={() => {handlerSalvarFinanciamento()}} typeButton={'success'} width={335} />
                </View>
            }

           
            {Object.entries(financiamento).length > 0 &&
                <ModalSystem 
                    heightProp={700}
                    widthProp={450}
                    title={`${titleModal}`} 
                    children={
                        <View>
                            {resumoFinanciamento()}
                        </View>
                    } 
                    setVisible={setModalShow} 
                    visible={modalShow} 
                />
            }
        </BaseScreens>
    )
}

export default Financiamento