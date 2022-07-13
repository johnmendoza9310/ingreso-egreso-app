//Reducer global de la aplicación
import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';


export interface AppState {
   ui: ui.State  //referencia a interfaz
}



export const appReducers: ActionReducerMap<AppState> = {
   ui: ui.uiReducer,
}