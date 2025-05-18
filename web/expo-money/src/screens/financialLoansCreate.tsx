import { Dimensions, FlatList, ScrollView, TouchableOpacity, View } from "react-native"
import BaseScreens from "./BaseScreens"
import TextComponent from "../components/text/text"
import { flatListBorderColor, textColorPrimary, textColorSuccess, textColorWarning } from "../constants/colorsPalette "
import InputText from "../components/inputText"
import { useEffect, useState } from "react"
import ButtonComponent from "../components/button"
import DropDow from "../components/dropdow"
import { CustomerDTO } from "../types/customerDTO"
import api from "../integration/axiosconfig"
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from 'react-native'
import { useRoute } from "@react-navigation/native"
import { FinancialLoans } from "../types/financialLoans"
import { FinancialLoansCreateDTO, ModalityFinancing } from "../types/financialLoansCreateDTO"
import { Ionicons } from "@expo/vector-icons"
import ModalSystem from "../components/modal"
import { CustomerCommitmentItemDTO } from "../types/customerCommitmentItemDTO"
import { CalculationUtilDTO } from "../types/calculationUtilDTO"


const FinancialLoansCreate = () => {

    const route = useRoute();
    const { customer } : any = route.params;

    const param : boolean = Object.entries(customer).length > 0 ? true : false;  

    const [simulator, setSimulator] = useState<boolean>(true)
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [customerDTO, setCustomerDTO] = useState<CustomerDTO[]>([])
    const [filter, setFilter] = useState<string>(param ? `${customer.firsName} ${customer.lastName}` : "")
    const [showDropdow, setShowDropDow] = useState<boolean>(false)
    const [customerId, setCustomerId] = useState<string>(param ? customer.id : "")
    const [financialLoans, setFinancialLoans] = useState<FinancialLoans>({} as FinancialLoans)

    const [value, setValue] = useState<string>("")
    const [rate, setRate] = useState<string>("")
    const [lateInterest, setLateInterest] = useState<string>("")
    const [additionForDaysOfDelay, setAdditionForDaysOfDelay] = useState<string>("")
    const [cashInstallment, setCashInstallment] = useState<string>("")

    const [modalityFinancing, setModalityFinancing] = useState<ModalityFinancing>(ModalityFinancing.FINANCING)
    const [onerousLoanValue, setOnerousLoanValue] = useState<string>("")

    const [showPicker, setShowPicker] = useState(false)
    const [startDateDue, setStartDateDue] = useState(new Date())
    const [showPickerEndDate, setShowPickerEndDate] = useState(false)
    const [endDateDue, setEndDateDue] = useState(new Date())

    const [customerCommitmentItemDTO, setCustomerCommitmentItemDTO] = useState<CustomerCommitmentItemDTO[]>([])
    const [customerCommitmentItemDTOSelected, setCustomerCommitmentItemDTOSelected] = useState<CustomerCommitmentItemDTO[]>([])
    const [valueCommitmentItem, setValueCommitmentItem] = useState<number>(0)

    const [successOperation, setSuccessOperation] = useState<boolean>(false)

    const width = Dimensions.get("window").width

    function handlerCleanFinancial(){
        setValue("")
        setRate("")
        setLateInterest("")
        setAdditionForDaysOfDelay("")
        setCashInstallment("")
        setShowPicker(false)
        setShowPickerEndDate(false)
        setStartDateDue(new Date())
        setEndDateDue(new Date())
        setSimulator(true)
        setCustomerDTO([])
        setFilter("")
        setShowDropDow(false)
        setCustomerId("")
        setFinancialLoans({} as FinancialLoans)
        setModalityFinancing(ModalityFinancing.FINANCING)
        setOnerousLoanValue("")
        setValueCommitmentItem(0)
        setCustomerCommitmentItemDTOSelected([])
        setCustomerCommitmentItemDTO([])
        setSuccessOperation(false)
    }

    function handlerSelectCommitmentItem(item: CustomerCommitmentItemDTO) {
        const index = customerCommitmentItemDTOSelected.findIndex((i) => i.id === item.id);
        if (index !== -1) {
            setCustomerCommitmentItemDTOSelected((prev) => prev.filter((_, i) => i !== index));
            setValueCommitmentItem((prev) => Number((prev - item.valueItem).toFixed(2)));
        } else {
            setCustomerCommitmentItemDTOSelected((prev) => [...prev, item]);
             setValueCommitmentItem((prev) => Number((prev + item.valueItem).toFixed(2)));
        }
    }

    function handlerFinancialLoasnCreate(simulatorParam: boolean) {

        const valuelateInterest = modalityFinancing === ModalityFinancing.FINANCING ? lateInterest : rate;

        const createDTO : FinancialLoansCreateDTO = {
            value: Number.parseFloat(value.replace(".","").replace(",",".")),
            rate: Number.parseFloat(rate.replace(".","").replace(",",".").replace("%","")),
            lateInterest: Number.parseFloat(valuelateInterest.replace(".","").replace(",",".").replace("%","")),
            startDateDue: startDateDue,
            cashInstallment: Number.parseFloat(cashInstallment),
            customerId: customerId,
            simulator: simulatorParam,
            additionForDaysOfDelay: Number.parseFloat(additionForDaysOfDelay.replace(".","").replace(",",".")),
            modalityFinancing: modalityFinancing === ModalityFinancing.FINANCING ? 'FINANCING' : 'ONEROUS_LOAN',
            onerousLoanValue:  Number.parseFloat(onerousLoanValue.replace(".","").replace(",",".")),
            commitmentItems: customerCommitmentItemDTOSelected.length > 0 ? customerCommitmentItemDTOSelected : undefined,
            dateEndFinancialOnerousLoans: modalityFinancing === ModalityFinancing.ONEROUS_LOAN ? endDateDue : undefined
        }

        api.post('/financial', createDTO).then((response) => {
            setFinancialLoans(response.data)
            setSuccessOperation(response.data.id != null ? true : false)
        }).catch((error) => {
            alert(JSON.stringify(error))
            setSuccessOperation(false)
        })
  
    }

    useEffect(() => {
        handlerCleanFinancial();
        setFilter(customer === undefined ? "" : `${customer.firsName} ${customer.lastName}`)
        setCustomerId(customer === undefined ? "" : customer.id)
    },[customer])

    useEffect(() => {
        if(value.length > 0 && rate.length > 0) {
            const obj : CalculationUtilDTO = {
                capital: Number.parseFloat(value.replace(".","").replace(",",".")),
                rate: Number.parseFloat(rate.replace(".","").replace(",",".").replace("%","")),
            }

            api.post("/financial/calculateValueInstallmentDiary", obj).then((response) => {
                //alert(response.data);
                setOnerousLoanValue(response.data.toString().replace(".",","))
                setAdditionForDaysOfDelay(response.data.toString().replace(".",","))
                setCashInstallment("1")
            })

        }
    }, [modalityFinancing, rate, value])

    useEffect(() => {
        api.get(`/customerCommitment/findByCustomer/${customerId}`).then((response) => {
            setCustomerCommitmentItemDTO(response.data);
           }).catch((error) => {
            customerId != "" && alert("Erro ao buscar itens do cliente: "  + JSON.stringify(error));
           })
    }, [customerDTO])

    useEffect(() => {
        if(filter.length === 0) {
            setCustomerDTO([])
            setShowDropDow(false)
            return
        }
        setShowDropDow(true)
        api.post("/customer/filterByNome", filter).then((response) => {
            if(response.data.length === 0) {setShowDropDow(false)}
            setCustomerDTO(response.data)
        })
    },[filter, customer])

    return(
        <BaseScreens title=" ">
            <>
                <View style={{ display: Object.entries(financialLoans).length === 0 ? "flex" : "none", width: width, alignItems:"center", gap: 15, padding: 20 }}>
                    <TextComponent text="Criando Empréstimo" color={textColorPrimary} fontSize={20} textAlign={"auto"} />
                    
                    <InputText 
                        label="Cliente *" 
                        value={filter}
                        width={330}
                        editable
                        onChangeText={(text) => setFilter(text) }
                    />
                    <DropDow display={showDropdow ? "flex" : "none"} width={330} top={139}> 
                        <View style={{ gap: 10, padding: 10}}>
                            {customerDTO && customerDTO.map((item, key) => (
                                <TouchableOpacity 
                                    onPress={() => { setShowDropDow(false), setFilter(item.firsName + " " + item.lastName), setCustomerId(item.id)}}
                                >
                                    <TextComponent key={key.toString()} text={item.firsName + " " + item.lastName} color={"rgb(36, 36, 36)"} fontSize={20} textAlign={"auto"} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </DropDow>

                    <View style={{width: width - 50}}>
                        <ButtonComponent nameButton={`TIPO: ${modalityFinancing.toUpperCase()}`} onPress={()=> {setModalityFinancing(modalityFinancing === ModalityFinancing.FINANCING ? ModalityFinancing.ONEROUS_LOAN : ModalityFinancing.FINANCING)} } typeButton={"primary"} width={"100%"} />
                    </View>

                    <View style={{ width: width, display:"flex", flexDirection:"row", flexWrap:"wrap", gap: 20, justifyContent: "center", alignItems: "center" }}>

                        <InputText 
                            editable
                            label="Valor *" 
                            money={true}
                            keyboardType="numeric"
                            value={value}
                            width={150}
                            onChangeText={(text) => {setValue(text)}}
                        />

                        <InputText 
                            editable
                            label="Juros Empréstimo *" 
                            keyboardType="numeric"
                            value={rate}
                            width={150}
                            percentage
                            onChangeText={(text) => { setRate(text)}}
                        />

                        {modalityFinancing === ModalityFinancing.FINANCING &&
                            <InputText 
                                editable
                                label="Juros Atraso *" 
                                keyboardType="numeric"
                                value={lateInterest}
                                width={150}
                                percentage
                                onChangeText={(text) => {setLateInterest(text)}}
                            />
                        }

                        { modalityFinancing === ModalityFinancing.ONEROUS_LOAN &&
                            <InputText 
                            editable={false}
                            label="Valor Diário *" 
                            money
                            keyboardType="numeric"
                            value={onerousLoanValue}
                            width={150}
                            onChangeText={(text) => { setOnerousLoanValue(text)}}
                        />
                        }

                        { modalityFinancing === ModalityFinancing.FINANCING &&
                            <>
                                <InputText 
                                    editable
                                    label="Adicional Por Dia Atraso *" 
                                    money
                                    keyboardType="numeric"
                                    value={additionForDaysOfDelay}
                                    width={150}
                                    onChangeText={(text) => { setAdditionForDaysOfDelay(text)}}
                                />
                        
                                <InputText 
                                    editable
                                    label="Quantidade Parcelas *" 
                                    keyboardType="numeric"
                                    value={cashInstallment}
                                    width={150}
                                    onChangeText={(text) => { setCashInstallment(text)}}
                                />
                            </>
                    }

                        <TouchableOpacity
                            onPress={() => setShowPicker(true)}
                        >
                            <InputText 
                                label="Data Início"
                                editable={false}
                                width={150}
                                value={startDateDue.toLocaleDateString('pt-BR')}
                            />
                        </TouchableOpacity>

                        {showPicker && (
                            <DateTimePicker
                                value={startDateDue}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={(event, selectedDate) => {
                                setShowPicker(false)
                                if (selectedDate) setStartDateDue(selectedDate)
                                }}
                            />
                        )}

                        {modalityFinancing === ModalityFinancing.ONEROUS_LOAN && 
                            <TouchableOpacity
                                onPress={() => setShowPickerEndDate(true)}
                            >
                                <InputText 
                                    label="Data Fim"
                                    editable={false}
                                    width={150}
                                    value={endDateDue.toLocaleDateString('pt-BR')}
                                />
                            </TouchableOpacity>
                        }

                        {showPickerEndDate && (
                            <DateTimePicker
                                value={endDateDue}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={(event, selectedDate) => {
                                setShowPickerEndDate(false)
                                if (selectedDate) setEndDateDue(selectedDate)
                                }}
                            />
                        )}
                    </View>

                    <View  style={{ width: width-50, display:"flex", flexDirection:"column", gap: 15, justifyContent: "center", alignItems: "flex-end"}}>
                        
                        <ButtonComponent nameButton={`GARANTIA ${valueCommitmentItem.toLocaleString('pt-BR', {style:"currency", currency:"BRL"})}`} onPress={()=> {setIsModalVisible(!isModalVisible)} } typeButton={"primary"} width={"100%"} />

                        <ModalSystem 
                            title="GARATIA EMPRÉSTIMO"
                            setVisible={setIsModalVisible} 
                            visible={isModalVisible}
                            heightProp={700}
                            children={
                                <View style={{ display: "flex", flexDirection:"column", gap: 20, width: "auto", alignItems:"center", height: 330 }}>
                                   
                                   <TextComponent text={`Total valor Garantia: ${valueCommitmentItem.toLocaleString('pt-BR', {style:"currency", currency:"BRL"})} `} color={textColorPrimary} fontSize={10} textAlign={"auto"} />
                                    <FlatList 
                                        data={customerCommitmentItemDTO}
                                        keyExtractor={(key) => key.toString()}
                                        renderItem={({item}) => (
                                            <TouchableOpacity onPress={() => { item.warranty == false && handlerSelectCommitmentItem(item) }} >
                                                <View style={{ 
                                                    display:"flex", 
                                                    width: "100%", 
                                                    flexDirection:"column", 
                                                    alignContent:"flex-start", 
                                                    justifyContent:"flex-start",
                                                    paddingTop: 15,
                                                    paddingInline: 20,
                                                    paddingBottom: 5,
                                                    borderWidth:1,
                                                    borderRadius: 10,
                                                    marginBottom: 20,
                                                    gap: 10,
                                                    borderBottomColor: flatListBorderColor,
                                                    backgroundColor: customerCommitmentItemDTOSelected.filter((i) => i.id === item.id).length > 0 ? "rgba(132, 247, 78, 0.11)" : item.warranty ? "rgba(255, 255, 255, 0.64)":"transparent",
                                                }}>
                                                    {item.warranty &&<TextComponent text="Garantia já está em uso em outro financiamento" color={textColorPrimary} fontSize={12} textAlign={"center"}/>}
                                                    
                                                    <View style={{ display: "flex", flexDirection:"row", gap: 20, width: "100%", alignItems:"center"}}>
                                                        <Ionicons name="return-up-forward-outline" size={15} color={textColorWarning}/>
                                                        
                                                        <TextComponent 
                                                            text={`${item.nameItem}`}
                                                            color={"rgb(255, 255, 255)"} fontSize={12} textAlign={"center"}
                                                        />
                                                    </View>
                                                    <TextComponent 
                                                        text={`${item.valueItemFormated}`}
                                                        color={"rgb(255, 255, 255)"} fontSize={12} textAlign={"left"}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View> 
                            }/>
                        
                        <ButtonComponent 
                            nameButton={"PROSSEGUIR"} 
                            onPress={()=> {handlerFinancialLoasnCreate(true)} } 
                            typeButton={"primary"} 
                            width={"100%"} 
                            isDisabled={
                                (customerId              === "" || customerId                === null) &&
                                (value                   === "" || value                     === null) &&
                                (rate                    === "" || rate                      === null) &&
                                (lateInterest            === "" || lateInterest              === null) &&
                                (additionForDaysOfDelay  === "" || additionForDaysOfDelay    === null) &&
                                (cashInstallment         === "" || cashInstallment           === null) &&
                                startDateDue            === undefined
                            }
                        />
                        
                    </View>
                </View>
                {Object.entries(financialLoans).length > 0 && 

                    <View style={{ 
                            display: Object.entries(financialLoans).length > 0 ? "flex" : "none", 
                            marginTop: 10,
                            width: width, 
                            alignItems:"center", 
                            alignContent:"center",
                            justifyContent:"center",
                            gap: 20
                    }}>
                        <TextComponent text="Dados do Empréstimo" color={textColorPrimary} fontSize={20} textAlign={"auto"} />

                        <TextComponent text={`${financialLoans.customer.firsName} ${financialLoans.customer.lastName}`} color={textColorPrimary} fontSize={16} textAlign={"auto"} />

                       
                        <View style={{ display: modalityFinancing === ModalityFinancing.FINANCING ?  "flex" : "none", flexDirection:"row", justifyContent:"space-between", gap:20, alignItems:"center" }}>
                            <Ionicons name="calendar-number-outline" size={15} color={textColorWarning}/>
                            <TextComponent text={`Adicional por dia de atraso: ${financialLoans.additionForDaysOfDelayFormat}`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                        </View>

                        <View style={{ display: "flex", flexDirection:"row", justifyContent:"space-between", gap:20, alignItems:"center" }}>
                            <Ionicons name="pricetag-outline" size={15} color={textColorWarning}/>
                            <TextComponent text={`Juros: ${financialLoans.rate}%`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                            {modalityFinancing === ModalityFinancing.FINANCING &&
                                <TextComponent text={`Em Atraso: ${financialLoans.lateInterest}%`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                            }
                            <TextComponent text={`Garantia: ${valueCommitmentItem.toLocaleString('pt-BR', {style:"currency", currency:"BRL"})}`} color={textColorPrimary} fontSize={12} textAlign={"auto"} />
                        </View>

                        <View style={{ display: "flex", flexDirection:"row", justifyContent:"space-between", gap:20 }}>
                            <Ionicons name="wallet-outline" size={15} color={textColorWarning}/>
                            <TextComponent text={`Valor: ${financialLoans.valueFormat}`} color={textColorPrimary} fontSize={14} textAlign={"auto"} />
                            <TextComponent text={`Total: ${financialLoans.valueTotalFormat}`} color={textColorPrimary} fontSize={14} textAlign={"auto"} />
                        </View>

                        <ScrollView  style={{ height: 300, padding: 20, gap: 20 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", padding: 20 }}>
                            <FlatList 
                                data={financialLoans.loansPaids}
                                keyExtractor={(key) => key.toString()}
                                renderItem={({item}) => (
                                    <View style={{ 
                                        display:"flex", 
                                        gap: 10,
                                        width: width-80, 
                                        flexDirection:"column", 
                                        alignContent:"space-between", 
                                        justifyContent:"space-between",
                                        paddingTop: 15,
                                        paddingInline: 20,
                                        paddingBottom: 5,
                                        borderWidth:1,
                                        borderRadius: 10,
                                        marginBottom: 10,
                                        borderBottomColor: flatListBorderColor,
                                    }}>
                                        <View style={{ display: "flex", flexDirection:"row", width: "100%", justifyContent:"space-between", alignItems:"center"}}>
                                            <Ionicons name="return-up-forward-outline" size={15} color={textColorWarning}/>
                                            <TextComponent 
                                                text={`${item.portion}º`}
                                                color={"rgb(255, 255, 255)"} fontSize={12} textAlign={"center"}
                                            />
                                            <Ionicons name="calendar" size={15} color={textColorWarning}/>
                                            <TextComponent 
                                                text={`${item.dueDate}`}
                                                color={"rgb(255, 255, 255)"} fontSize={12} textAlign={"center"}
                                            />
                                            <Ionicons name="cash" size={15} color={textColorSuccess}/>
                                            <TextComponent 
                                                text={`${item.installmentValueFormat} `} 
                                                color={"rgb(255, 255, 255)"} fontSize={12} textAlign={"center"} />
                                        </View>
                                        <View style={{ display: "flex", flexDirection:"row", width: "100%", alignItems:"center"}}>
                                        {modalityFinancing === ModalityFinancing.ONEROUS_LOAN &&
                                            <View style={{ display: "flex", flexDirection:"row", gap: 20, width: "100%", alignItems:"center"}}>
                                                <Ionicons name="alarm-outline" size={15} color={textColorWarning}/>
                                                <TextComponent text={"Diária: "} color={textColorPrimary} fontSize={12} textAlign={"center"} />
                                                {item.valueDiary != null &&
                                                <TextComponent text={item.valueDiaryFormat} color={textColorPrimary} fontSize={12} textAlign={"auto"} />}
                                                <Ionicons name="calendar-number-outline" size={15} color={textColorWarning}/>
                                                <TextComponent text={endDateDue.toLocaleDateString('pt-BR')} color={textColorPrimary} fontSize={12} textAlign={"center"} />
                                            </View>
                                        }
                                        
                                        </View>
                                    </View>
                                )}
                            />
                        </ScrollView>

                        {successOperation == false && 
                            <View style={{ display: "flex", flexDirection:"row", gap:20, width: width-70, alignItems:"center"}}>
                                <ButtonComponent nameButton="EDITAR" onPress={()=> {setFinancialLoans({} as FinancialLoans)} } typeButton={"warning"} width={"50%"} />
                                <ButtonComponent nameButton="EMPRESTAR" onPress={()=> {setSimulator(false), handlerFinancialLoasnCreate(false)} } typeButton={"success"} width={"50%"} />
                            </View>
                        }
                        {successOperation == true &&
                            <View style={{ display: "flex", flexDirection:"row", gap:20, width: width-70, alignItems:"center"}}>
                                <Ionicons name="ribbon-outline" size={18} color={textColorSuccess}/>
                                <TextComponent text={`Contrato Realizado com Sucesso!`} color={textColorPrimary} fontSize={18} textAlign={"center"} />
                            </View>
                        }
                        
                    </View>
                }
                <View style={{ width: width, alignItems:"center", gap: 20, padding: 20 }}>
                    <ButtonComponent nameButton={"LIMPAR"} onPress={()=> { handlerCleanFinancial()} } typeButton={"warning"} width={"100%"} />
                </View>
            </>
        </BaseScreens>
    )
}
export default FinancialLoansCreate