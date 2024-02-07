<script setup lang="ts">
import { ref, computed, watch} from 'vue';
import type { Method } from '../models/method.ts';
import type { Payment } from '../models/payment.ts';
import MethodsApi from '../api/resources/Methods';
import PaymentsApi from '../api/resources/Payments';

const toCurrency = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
});

function convertToCurrency(amount: number){
    return toCurrency.format(amount) 
}

const isActiveCalculator= ref<boolean>(false);
const total = ref<number>(0);
const totalInCalculator = ref<string>('');
const persons = ref<number>(0);
const prefix = ref<string>('');
const selectedPaymentType = ref<Method>();

function useCalculator(): void {
  isActiveCalculator.value = true;
  prefix.value = '$'

}

function changeAmount(newValue: string){
  totalInCalculator.value+=newValue;
}

function removeDigit() {
  totalInCalculator.value = totalInCalculator.value.slice(0, -1);
}

function assignTotal(): void {
  if(selectedPaymentType.value || payments.value.length > 0){
    const payment: Payment = {
      type: selectedPaymentType.value?.name || '',
      amount: parseInt(totalInCalculator.value)
    }
    savePayment(payment);
    totalInCalculator.value = '';
    selectedPaymentType.value = undefined;
    
    return;
  }
 
  if(prefix.value === '$'){
    total.value = parseInt(totalInCalculator.value);
    totalInCalculator.value = '';
    prefix.value = '#';
  }else{
    persons.value = parseInt(totalInCalculator.value);
    totalInCalculator.value = '';
  }
}

async function savePayment(payment: Payment) {
  
  const result = await  PaymentsApi.store(payment);
  if(result === 200){
    payments.value = await PaymentsApi.index();
    
  }
 
}

async function removePayment(id: number) {
  const result = await  PaymentsApi.delete(id);
  if(result === 200){
    payments.value = await PaymentsApi.index();
  }
}

function selectPaymentType(method: Method){
  selectedPaymentType.value = method
  prefix.value = '$';
  
}

const dividedBy = computed(() => {
  return persons.value > 0 ? (total.value / persons.value) : 0
});

const totalPayed = computed(() => {
  return payments.value.reduce((suma, actual) => suma + actual.amount, 0);
});

const buttons = [
  {
    value: 1,
    text: '1'
  },
  {
    value: 2,
    text: '2'
  },
  {
    value: 3,
    text: '3'
  },
  {
    value: 4,
    text: '4'
  },
  {
    value: 5,
    text: '5'
  },
  {
    value: 6,
    text: '6'
  },
  {
    value: 7,
    text: '7'
  }
  ,
  {
    value: 8,
    text: '8'
  }
  ,
  {
    value: 9,
    text: '9'
  }
  ,
  {
    value: '00',
    text: '00'
  }
  ,
  {
    value: 0,
    text: '0'
  }
  
];

const paymentMethods = ref<Method[]>([]) 
const payments = ref<Payment[]>([]);

const lists =   Promise.all([
    MethodsApi.index(),
    PaymentsApi.index()
  ]);
lists.then(results => {
  paymentMethods.value = results[0];
  payments.value = results[1];
  
})

watch(totalPayed, (newtotalPayed, oldtotalPayed) => {
  if (newtotalPayed >= total.value) {
    isActiveCalculator.value = false;
  }
})


</script>

<template>
  <div class="row">
    <div class="col col-4">
      <span class="font-weight-bolder orange-text">
        Total de Propinas
      </span>
      <div class="text-center">
        <span class="bg-orange-light font-weight-normal orange-text price-high">
        {{ convertToCurrency(total) }}
      </span>
      <button @click="useCalculator()" class="button-edit">
        <img src="../assets/pencil.svg" alt="">
      </button>
      </div>
      <span class="font-weight-bolder font-size-normal">
        ¿Entre cuántos quieres dividir las Propinas?
      </span>
      <div class="d-flex justify-space-between align-items-center">

        <input type="number" class="input-personas" placeholder="#" v-model="persons">
        <span class="orange-text font-weight-bolder font-size-normal"> {{ convertToCurrency(dividedBy) }} x Persona</span>
      </div>
      <div class="payment-methods">
        <img class="wallet" src="../assets/wallet-bifold-outline.svg" alt="">
        <span class="font-weight-bolder font-size-normal">Elige el methodo de pago</span>
        <div class="row">
          <div class="col col-6" v-for="p in paymentMethods" :key="p.id">
              <div
              class="card font-weight-bolder text-center " 
              :class="p.id === selectedPaymentType?.id ?'card-selected':''" 
              @click="selectPaymentType(p)">
               {{p.name}}
              </div>
        </div>
        </div>
        
      </div>
    </div>
    <div class="col col-4">
      <div class="calculadora text-center" :class="isActiveCalculator?'calc-active':''">
        <label for="input-calculator" class="prefix">{{ prefix }}</label>
       
        
        <input name="input-calculator" id="input-calculator" :disabled="!isActiveCalculator" :value="totalInCalculator" type="number" class="input-cantidad">
        <button @click="removeDigit()" class="suffix">
          <img src="../assets/backspace-outline.svg" alt="">
        </button>
        <div class="row font-height-normal botones" >
          <div class="col-4"   v-for="(b, index) in buttons" :key="index">
            <button
            @click="changeAmount(b.text)"
            :disabled="!isActiveCalculator"
            class="button-calculadora"
            >
            {{ b.text }}
          </button>
          
          </div>
          <div class="col-4">
            <button
            :disabled="totalInCalculator.length === 0"
            class="button-calculadora button-enter"
            @click="assignTotal()"
            >
            <img src="../assets/check-circle-outline.svg" alt="">
          </button>
          </div>
         
        </div>
        
      </div>
    </div>
    <div class="col col-4">
      <div
      v-for="(p, index) in payments"
      :key="index + 1"
      class="card d-flex justify-space-between align-items-center">
          <div class="font-height-small font-weight-bolder">{{ p.type }}</div>
          <div class="font-height-small font-weight-bolder d-inline">{{ p.amount }}
            <button class="button-delete" @click="removePayment(p.id)">
              <img src="../assets/close.svg" alt="">
            </button>
           
          </div>
      </div>
      <div class="card d-flex align-items-center" v-if="payments.length === 0">
          <span class="font-height-small font-weight-bolder no-content">Sin Pagos</span>
      </div>
    
    </div>
  </div>
  <div class="row align-items-center">
    <div class="col col-6">
      <div class="d-block orange-text">
        <div class="font-weight-bolder font-height-normal text-center d-inline">
          Total pagado {{ convertToCurrency(totalPayed) }}
        </div>
      </div>
      <div class="d-block">
        <div class="font-weight-bolder font-height-normal text-center d-inline">
          Restante por pagar {{ convertToCurrency(total - totalPayed) }}
        </div>
      </div>
    </div>
    <div class="col col-6">
      <button
      :disabled="payments.length === 0"
      class="boton-pagar"
      >
        Pagar {{ convertToCurrency(totalPayed) }} propinas
      </button>
    </div>

  </div>
</template>
<style lang="css">
  .no-content{
    padding-left: 20px;
  }
  .payment-methods{
    padding:  20px 0;
  }
  .calculadora{
    border-radius: 5px;
    background: var(--grey-light);
    width: 100%;
    max-height: 600px;
    padding: 20px;
    max-width: 400px;
  }
.botones{
  margin-top: 10px;
  margin: auto;
}
  .button-calculadora{
    height: 50px;
    width: 50px;
    text-align: center;
    border-radius: 5px;
    border: none;
    font-size: 25px;
    margin-top: 10px;
    background: white;
  }

  .button-enter{
    background: var(--grey);
    color: white;
    text-align: center;
    img {
      height: 30px;
      width: 30px;
      margin-top: 3px;
    }
  }
  .button-calculadora:focus{
    border: none;
    outline: none;
    box-shadow: 0px 2px 1px 3px var(--grey);
  }

  .button-calculadora:hover{
    box-shadow: 0px 1px 2px 2px var(--grey);
  }
  .boton-pagar{
    text-align: center;
    border: none;
    border-radius: 50px;
    background: transparent;
    font-size: 15px;
    font-weight: bolder;
    width: 100%;
    height: 40px;
  }
  .boton-pagar:disabled{
    border: 2px solid var(--grey-light);
    color: var(--grey-light);
  }

  .boton-pagar:not(:disabled){
    background:  var(--orange);
    color: white;
  }

  .calc-active{
    background: var(--orange-light) !important;
    border: 1px solid var(--orange) !important;
    .button-enter{
      background: var(--orange) !important;
    }
  }
  .prefix{
    position: absolute;
    font-size: 25px;
    font-weight: bolder;
    margin-top: -3px;
  }
  .suffix{
    position: absolute;
    margin-top: -3px;
    width: 30px;
    height: 30px;
    background: transparent;
    overflow: hidden;
    border: none;
    cursor: pointer;
    margin-left: -20px;
  }

  .card-selected{
    background: var(--orange) !important;
    color: white;
  }
  .button-edit{
    background: transparent;
    border: none;
    img {
      height: 20px;
      width: 20px;
    }
  }
  .wallet{
    height: 30px;
    width: 30px;
    margin-bottom: -10px;
  }
  .button-delete{
    border: none;
    background: transparent;
    width: 20px;
    height: 20px;
    img{
      width: inherit;
      height: inherit;
      margin-left: -5px;
      margin-bottom: -5px;
    }
  }
</style>