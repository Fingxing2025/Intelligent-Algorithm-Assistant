#include <bits/stdc++.h>
using namespace std;
using ll=long long;
ll qp(ll x,ll n,ll Mod){
	ll ans=1;
	while(n>0){
		if(n&1) ans=ans*x%Mod;
		x=x*x%Mod;
		n>>=1;
	}
	return ans;
}
int main(){
	ios_base::sync_with_stdio(false);
	cin.tie(nullptr);
	cout<<(qp(2,4042,1e9+7)+qp(2,2021,1e9+7))%ll(1e9+7);
}