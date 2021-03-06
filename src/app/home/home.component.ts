import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { GraphqlProductsService } from '../graphql.products.service';
import { Subscription } from 'rxjs';
import { GraphqlUsersService} from '../graphql.users.service';
import { trigger, style,transition, animate,keyframes,query,stagger } from '@angular/animations';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
  	trigger('goals',[
  		 transition('* => *', [
  		 	query(':enter',style({opacity: 0}),{optional:true}),

  		 	query(':enter', stagger('300ms', [
  		 		 animate('.6s ease-in', keyframes([
  		 		 	style({opacity:0,transform: 'translateY(-75%)',offset:0}),
            style({opacity:.5,transform: 'translateY(35px)',offset:.3}),
            style({opacity:1,transform: 'translateY(0)',offset:1}),
  		 		 	]))]), {optional:true}),

        query(':leave', stagger('300ms', [
           animate('.6s ease-in', keyframes([
            style({opacity:0,transform: 'translateY(-75%)',offset:0}),
            style({opacity:.5,transform: 'translateY(35px)',offset:.3}),
            style({opacity:1,transform: 'translateY(0)',offset:1}),
            ]))]),{optional:true})

  		 	])
  		])	
  ]
})

export class HomeComponent implements OnInit {
  itemCount: number = 4;
  btnText: string = 'Add an item';
  goalText: string = 'My first life goal';
  user: string = ''
  pass: string = ''
  token: string = ''
  goals=[];
  loading : boolean;
  private querySubscription: Subscription;
  constructor(private _data:DataService, private graphqlProductsService: GraphqlProductsService,
              private graphqlUsersService : GraphqlUsersService) { }
  ngOnInit(){
	  //this._data.goal.subscribe(res => this.goals = res);
	  this.itemCount = this.goals.length;
	  //this._data.changeGoal(this.goals); 
	  this.querySubscription = this.graphqlProductsService.links("-")
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.goals = JSON.parse(JSON.stringify(data)).links;
        console.log(JSON.stringify(this.goals))
      });
  }
  loginUser() {

    alert(this.user + " - " + this.pass);
    this.graphqlUsersService.tokenAuth(this.user, this.pass)
    .subscribe(({ data }) => {
       console.log('logged: ', JSON.stringify(data));
      // this.storageService.setSession("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      //this.storageService.setLocal("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      this.token =  JSON.parse(JSON.stringify(data)).tokenAuth.token;


      //this.loginService.showData(mydata);
      // this.router.navigate(['/']);

    }, (error) => {
       console.log('there was an error sending the query', error);
    });

  }
  addItem(){
	  //this.goals.push(this.goalText);
	  var mytoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkc29mdCIsImV4cCI6MTYzNDc5NTgwMiwib3JpZ0lhdCI6MTYzNDc5NTUwMn0._6tOsFeS7Li59toIpxyD1rDNi_HXnjvcDPBjoKXNcUk";
	  alert(this.goalText);
	  this.graphqlProductsService.createLink(mytoken, "https://www.github.com", this.goalText)
    .subscribe(({ data }) => {
       console.log('link created :  ', data);
    }, (error) => {
       console.log('there was an error sending the query', error);
    });
	  this.goalText='';
	  this.itemCount = this.goals.length;
          this._data.changeGoal(this.goals);
	  window.location.reload();
  }
  removeItem(i){
	  this.goals.splice(i,1);
	  this._data.changeGoal(this.goals);

   }
}

