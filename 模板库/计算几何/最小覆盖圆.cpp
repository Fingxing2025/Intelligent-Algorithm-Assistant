#include <bits/stdc++.h>
using namespace std;
using ll=long long;
const double eps=1e-12;
struct Point{
	double x,y;
};
struct Circle{
	Point c;
	double r;
};
double dist(Point a,Point b){
	return hypot(a.x-b.x,a.y-b.y);
}
bool in_circle(Point p,Circle c){
	return dist(p,c.c)<=c.r+eps;
}
Circle get_circle2(Point a,Point b){
	Point c={(a.x+b.x)/2.0,(a.y+b.y)/2.0};
	return {c,dist(a,b)/2.0};
}
Circle get_circle3(Point p1,Point p2,Point p3){
	double ax=p2.x-p1.x,ay=p2.y-p1.y;
	double bx=p3.x-p1.x,by=p3.y-p1.y;
	double d=2.0*(ax*by-ay*bx);
	double cx=(by*(ax*ax+ay*ay)-ay*(bx*bx+by*by))/d;
	double cy=(ax*(bx*bx+by*by)-bx*(ax*ax+ay*ay))/d;
	Point c={p1.x+cx,p1.y+cy};
	return {c,dist(c,p1)};
}
int main(){
	ios_base::sync_with_stdio(false);
	cin.tie(nullptr);
	int n; cin>>n;
	vector<Point> a(n);
	for(int i=0;i<n;++i) cin>>a[i].x>>a[i].y;
	mt19937 rng(114514);
	shuffle(a.begin(),a.end(),rng);
	Circle ans={a[0],0.0};
	for(int i=1;i<n;++i)
		if(!in_circle(a[i],ans)){
			ans={a[i],0.0};
			for(int j=0;j<i;++j)
				if(!in_circle(a[j],ans)){
					ans=get_circle2(a[i],a[j]);
					for(int k=0;k<j;++k)
						if(!in_circle(a[k],ans))
							ans=get_circle3(a[i],a[j],a[k]);
				}
		}
	cout<<fixed<<setprecision(10);
	cout<<ans.r<<"\n";
	cout<<ans.c.x<<" "<<ans.c.y<<"\n";
}
