import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../../classes/user';
import { Asset } from '../../../classes/asset';
import { Recommendation } from '../../../classes/recommendation';
import { UserProvider } from '../../providers/user/user';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { OrderPage } from '../order/order';
/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  user: User;
  assets: Asset[];
  totalAssets: number;
  research: any;
  recommendations: Recommendation[];
  recommendationAssets: Asset[];
  riskBlurb: string;

  constructor(
    public userProvider: UserProvider,
    public http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.user = navParams.get('user');
    this.recommendations = this.user.recommendations;
    this.generateRiskBlurb();
    this.assets = new Array<Asset>();
    this.recommendationAssets = new Array<Asset>();
    this.loadAssets();
    this.loadResearch();
    this.loadRecommendatons();
  }

  ionViewDidLoad() {
  }


  loadAssets() {
    var baseUrl = "https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES";
    var symbols = "&symbols=";
    var apiKey = "&apikey=TRDOTVDYQ5Y7A9XX"
    for (let asset of this.user.ownedAssets) {
      symbols += asset.symbol + ",";
    }
    var url: string = baseUrl + symbols + apiKey;
    this.http.get(url).subscribe(data => {
        this.buildAssets(data["Stock Quotes"]);
        this.calculateTotal();
        // console.log(this.assets);
    });
  }

  loadRecommendatons() {
    var baseUrl = "https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES";
    var symbols = "&symbols=";
    var apiKey = "&apikey=TRDOTVDYQ5Y7A9XX"
    for (let rec of this.user.recommendations) {
      symbols += rec.symbol + ",";
    }
    var url: string = baseUrl + symbols + apiKey;
    console.log(url);
    this.http.get(url).subscribe(data => {
        this.buildRecommendations(data["Stock Quotes"]);
        console.log(this.recommendationAssets);
    });
  }


  buildAssets(data: any[]) {
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var newAss : Asset = new Asset();
        var currentItem = data[i];
        newAss.symbol = currentItem["1. symbol"];
        console.log(newAss.symbol);
        newAss.price = currentItem["2. price"];
        newAss.volume = currentItem["3. volume"];
        newAss.timestamp = currentItem["4. timestamp"];
        this.assets.push(newAss);
      }
    }
  }

  buildRecommendations(data: any[]) {
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        var newAss : Asset = new Asset();
        var currentItem = data[i];
        newAss.symbol = currentItem["1. symbol"];
        newAss.price = currentItem["2. price"];
        newAss.volume = currentItem["3. volume"];
        newAss.timestamp = currentItem["4. timestamp"];
        this.recommendationAssets.push(newAss);
      }
    }
  }

  navToOrder(user: User, asset: Asset) {
    this.navCtrl.push(OrderPage, {
      user: user,
      asset: asset,
      callback: this.updateUser
    });
  }

  updateUser = (updatedUser) => {
    return new Promise((resolve, reject) => {
      this.user = updatedUser;
      resolve();
    });
  }

  calculateTotal = () => {
    this.totalAssets = this.user.balance;
    for (var i = 0; i < this.assets.length; i++) {
      this.totalAssets += (+this.assets[i].price * this.user.ownedAssets[i].quantity);
    }

  }

  loadResearch = () => {
    this.research = new Array<any>();
    var query = 'q=';
    for (let interest of this.user.interests) {
      query += (interest + ',')
    }
    var url = 'https://newsapi.org/v2/everything?' +
      query + '&' +
      'sources=bloomberg,techcrunch,the-new-york-times,financial-times,financial-post&' +
      'apiKey=d5feddf7468e4a139eabefd17183a30f';
    // console.log(url);
    this.http.get(url).subscribe(data => {
        this.research = data;
        // console.log(this.research);
    });
  }

  navToArticle = (url: string) => {
    window.open(url);
  }

  updateRisk = (risk: string) => {
    if (risk == 'low') {
      this.user.riskProfile--;
    } else if (risk == 'medium') {
      return;
    } else if (risk == 'high') {
      this.user.riskProfile++;
    } else {
      return;
    }
  }

  generateRiskBlurb = () => {
    this.riskBlurb = "";
    if (this.user.riskProfile < 5) {
       this.riskBlurb = "Your portfolio is relatively low risk compared with your desired level of risk."
    } else if (this.user.riskProfile == 5) {
      this.riskBlurb = "Your portfolio aligns with your desired level of risk."
    } else if (this.user.riskProfile > 5) {
      this.riskBlurb = "Your portfolio is relatively high risk compared with your desired level of risk";
    }
  }
  // async loadRecommendatons() {
  //   this.recommendations = new Array<any>();
  //   var symbols = "";
  //   var baseUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY";
  //   var apiKey = "&apikey=TRDOTVDYQ5Y7A9XX"
  //
  //
  //   for (const asset of this.user.ownedAssets){
  //     symbols = "&symbol=" + asset.symbol;
  //     var url: string = baseUrl + symbols + apiKey;
  //     console.log("calling: "  + url);
  //     await this.http.get(url).subscribe(data => {
  //       this.recommendations.push(this.processRecData(data));
  //     });
  //   }

    // const promises = this.user.ownedAssets.map( (asset) => {
    //   symbols = "&symbol=" + asset.symbol;
    //   var url: string = baseUrl + symbols + apiKey;
    //   console.log("calling: "  + url);
    //   this.http.get(url).subscribe(data => {
    //     this.recommendations.push(this.processRecData(data));
    //   });
    // })
    //
    // await Promise.all(promises);

  //
  //   console.log(this.recommendations);
  // }

  // processRecData(data: any): number {
  //   var ts = data["Time Series (Daily)"];
  //   console.log(" TODAY: " + ts["2018-04-27"]["1. open"] + "    YESTERDAY: " + ts["2018-04-26"]["1. open"])
  //   var diff = +ts["2018-04-27"]["1. open"] - +ts["2018-04-26"]["1. open"];
  //   return diff;
  // }



}
