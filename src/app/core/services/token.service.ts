import {Injectable} from "@angular/core";    
import { BehaviorSubject } from "rxjs";

@Injectable()
export class TokenService {
active = new BehaviorSubject('eveg');

}