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
    console.log('ionViewDidLoad OrderPage');
  }

  changeAsset(newSymbol: string) {
    console.log("Changing asset...");
    var baseUrl = "https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES";
    var symbols = "&symbols=" + newSymbol;
    var apiKey = "&apikey=TRDOTVDYQ5Y7A9XX"

    this.http.get(baseUrl + symbols + apiKey).subscribe(
      success => {this.buildAsset(success["Stock Quotes"][0])},
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

    } else if (this.buyOrSell == "sell") {
      // sell
      if (this.user.ownedAssets[index].quantity > +qty && alreadyOwns) {
        this.user.ownedAssets[index].quantity -= +qty;
        this.user.ownedAssets[index].bookValue -= (+qty * +this.asset.price);
      } else {
        console.log("Not enough minerals");
        return;
      }
    } else {
      this.navCtrl.pop();
    }
    this.userProvider.updateUser(this.user).subscribe(res => {
      this.callback(res).then(() => this.navCtrl.pop());
    });

  }

  buildAsset(data: any) {
      if (data != null) {
        var newAss : Asset = new Asset();
        newAss.symbol = data["1. symbol"];
        newAss.price = data["2. price"];
        newAss.volume = data["3. volume"];
        newAss.timestamp = data["4. timestamp"];
        this.asset = newAss;
      } else {
        console.log("Data was null or undefined");
      }

  }



}
