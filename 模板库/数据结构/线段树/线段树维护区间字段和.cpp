#include <bits/stdc++.h>
using namespace std;
using ll=long long;
const int N=5e5+5;
int n,m;
struct data{
	ll sum,ans,lsum,rsum;
}tree[N*4];
void merge(int p){
	tree[p].sum=tree[p<<1].sum+tree[p<<1|1].sum;
	tree[p].lsum=max(tree[p<<1].lsum,tree[p<<1].sum+tree[p<<1|1].lsum);
	tree[p].rsum=max(tree[p<<1|1].rsum,tree[p<<1|1].sum+tree[p<<1].rsum);
	tree[p].ans=max(max(tree[p<<1].ans,tree[p<<1|1].ans),tree[p<<1].rsum+tree[p<<1|1].lsum);
}
void build(int p,int l,int r){
	if(l==r){
		int x; cin>>x;
		tree[p].sum=tree[p].ans=tree[p].lsum=tree[p].rsum=x;
		return;
	}
	int m=(l+r)>>1;
	build(p<<1,l,m);
	build(p<<1|1,m+1,r);
	merge(p);
}
void update(int p,int l,int r,int k,ll val){
	if(l==r){
		tree[p].sum=tree[p].lsum=tree[p].rsum=tree[p].ans=val;
		return;
	}
	int m=(l+r)>>1;
	if(k<=m) update(p<<1,l,m,k,val);
	else if(m<k) update(p<<1|1,m+1,r,k,val);
	merge(p);
}
data query(int p,int l,int r,int ql,int qr){
	if(ql<=l&&r<=qr) return tree[p];
	int m=(l+r)>>1;
	if(qr<=m) return query(p<<1,l,m,ql,qr);
	else if(m<ql) return query(p<<1|1,m+1,r,ql,qr);
	else{
		data now,ls=query(p<<1,l,m,ql,qr),rs=query(p<<1|1,m+1,r,ql,qr);
		now.sum=ls.sum+rs.sum;
		now.lsum=max(ls.lsum,ls.sum+rs.lsum);
		now.rsum=max(rs.rsum,rs.sum+ls.rsum);
		now.ans=max(max(ls.ans,rs.ans),ls.rsum+rs.lsum);
		return now;
	}
}
int main(){
	ios_base::sync_with_stdio(false);
	cin.tie(nullptr);
	cin>>n>>m;
	build(1,1,n);
	for(int i=1;i<=m;++i){
		int op; cin>>op;
		if(op==1){
			int l,r; cin>>l>>r;
			if(r<l) swap(l,r);
			data now=query(1,1,n,l,r);
			cout<<now.ans<<"\n";
		}
		else if(op==2){
			int k;ll val; cin>>k>>val;
			update(1,1,n,k,val);
		}
	}
}
