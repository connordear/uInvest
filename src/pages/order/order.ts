import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { UserProvider } from '../../providers/user/user';
import { User } from '../../../classes/user';
import { Asset } from '../../../classes/asset';
import { OwnedAsset } from '../../../classes/ownedAsset';
/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  user: User;
  asset: Asset;
  quantity: number;
  buyOrSell: string;
  callback: any;

  constructor(public userProvider: UserProvider, public http: HttpClient, public navCtrl: NavController, public navParams: NavParams) {
    this.user = navParams.get("user");
    if (navParams.get("asset") !== null) {
      this.asset = navParams.get("asset")
    } else {
      this.asset = new Asset();
    };
    this.callback = navParams.get("callback");

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad OrderPage');
  }

  changeAsset(newSymbol: string) {
    console.log("Changing asset...");
    var baseUrl = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE";
    var symbol = "&symbol=" + newSymbol;
    var apiKey = "&apikey=TRDOTVDYQ5Y7A9XX"
    console.log(baseUrl+symbol+apiKey);
    this.http.get(baseUrl + symbol + apiKey).subscribe(
      success => {this.buildAsset(success["Global Quote"])},
      error => {console.log(error);}
    );
  }

  submitOrder(qty: string) {
    // console.log("submitting order...");
    // console.log(this.buyOrSell);
    var alreadyOwns = false;
    var index = 0;
    while (index < this.user.ownedAssets.length) {
      if (this.user.ownedAssets[index].symbol === this.asset.symbol) {
        alreadyOwns = true;
        break;
      }
      index++;
    }
    if (this.buyOrSell == "buy") {
      // if they own, just update record
      if (alreadyOwns) {
        this.user.ownedAssets[index].quantity += +qty;
        this.user.ownedAssets[index].bookValue += +qty * +this.asset.price;
      } else {
        var newOwnedAsset: OwnedAsset = new OwnedAsset();
        newOwnedAsset.symbol = this.asset.symbol;
        newOwnedAsset.quantity = +qty;
        newOwnedAsset.bookValue = +this.asset.price * +qty;
        this.user.ownedAssets.push(newOwnedAsset);
      }
      this.user.balance -= (+this.asset.price * +qty);
    } else if (this.buyOrSell == "sell") {
      // sell
      if (this.user.ownedAssets[index].quantity > +qty && alreadyOwns) {
        this.user.ownedAssets[index].quantity -= +qty;
        this.user.ownedAssets[index].bookValue -= (+qty * +this.asset.price);
      } else {
        console.log("Not enough minerals");
        return;
      }
      this.user.balance += (+this.asset.price * +qty);
    } else {
      this.navCtrl.pop();
    }
    this.userProvider.updateUser(this.user).subscribe(res => {
      this.callback(res).then(() => this.navCtrl.pop());
    });

  }

  buildAsset(data: any) {
      if (data !== undefined) {
        var newAss : Asset = new Asset();
        newAss.symbol = data["01. symbol"];
        newAss.price = data["05. price"];
        newAss.volume = data["06. volume"];
        this.asset = newAss;
      } else {
        console.log("Data was undefined");
      }

  }



}
