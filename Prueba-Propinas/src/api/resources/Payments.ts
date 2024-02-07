import { APISettings } from '../config.js';
import type { Payment } from '@/models/payment';

export default {
    
    index( ){
        return fetch( APISettings.baseURL + '/payments', {
            method: 'GET',
            headers: APISettings.headers
        } )
        .then( function( response ){
            if( response.status !== 200 ){
                throw response.status;
            }else{
                return response.json();
            }
        });
    },

    store( data: Payment ){
        const request = new FormData(); 
        request.append('type', data.type);
        request.append('amount', data.amount.toString());
        APISettings.headers.set('Content-Type', 'application/json');

        return fetch( APISettings.baseURL + '/payments', {
            method: 'POST',
            headers: APISettings.headers,
            body:  JSON.stringify(data)
        } )
        .then( function( response ){
                return response.status;
        });
    },
    delete( id: number ){
      APISettings.headers.set('Content-Type', 'application/json');

      return fetch( APISettings.baseURL + '/payments/'+id, {
          method: 'DELETE',
          headers: APISettings.headers
      } )
      .then( function( response ){
              return response.status;
      });
  }
}