#include <iostream>
#include <cmath>
#include <algorithm>

using namespace std;

// ============================================================================
// 【第十六/十七届蓝桥杯 C/C++ 大学 A 组常用日期算法模板类】
// ============================================================================
namespace DateToolkit {

    // 平年每月天数常量数组（下标 1~12 分别对应 1~12 月）
    const int MONTH_DAYS[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

    // 平年每月天数前缀和（month_sum[i] 表示当年 1 月 1 日到第 i 月 1 日前一天的总天数）
    const int MONTH_DAYS_PREFIX[13] = {0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334};

    // 1. 闰年判定函数（Gregorian历）
    bool is_leap(long long y) {
        return (y % 4 == 0 && y % 100 != 0) || (y % 400 == 0);
    }

    // 2. 基姆拉尔森星期公式（最推荐，无拆分，0-周一, 6-周日）
    int get_weekday_kim(long long y, int m, int d) {
        if (m == 1 || m == 2) {
            m += 12;
            y--;
        }
        // 注意：C++ 的 % 在处理可能为负数的值时需要特别处理，但本公式中由于 y 和 m 均为正数，不会产生负数
        long long w = (d + 2 * m + 3 * (m + 1) / 5 + y + y / 4 - y / 100 + y / 400) % 7;
        return w; 
    }

    // 3. 蔡勒星期公式（经典款，需要拆分世纪，0-周六, 1-周日, ..., 6-周五）
    int get_weekday_zeller(long long year, int month, int day) {
        if (month == 1 || month == 2) {
            month += 12;
            year--;
        }
        long long c = year / 100;
        long long y = year % 100;
        long long m = month;
        long long d = day;
        
        long long w = d + 26 * (m + 1) / 10 + y + y / 4 + c / 4 - 2 * c;
        return (w % 7 + 7) % 7; // 防止模出负数
    }

    // 4. 计算当前日期距离公元 1 年 1 月 1 日的总天数（支持最大 10^9 年，O(1) 复杂度）
    long long get_total_days(long long y, int m, int d) {
        long long prev_y = y - 1;
        // 基础年天数 + 累计闰年增加的天数
        long long days = prev_y * 365 + prev_y / 4 - prev_y / 100 + prev_y / 400;
        
        days += MONTH_DAYS_PREFIX[m];
        
        // 当年是闰年且月份过了 2 月，需补上 2 月 29 日这一天
        if (m > 2 && is_leap(y)) {
            days += 1;
        }
        
        days += d;
        return days;
    }

    // 5. 计算任意两个日期的天数差（支持大年份，O(1) 复杂度）
    long long get_days_between(long long y1, int m1, int d1, long long y2, int m2, int d2) {
        return abs(get_total_days(y2, m2, d2) - get_total_days(y1, m1, d1));
    }
}

// ============================================================================
// 【主函数：测试与诊断挑战验证】
// ============================================================================
int main() {
    using namespace DateToolkit;

    // ---- 验证 1：测试星期计算公式的正确性 ----
    // 2000 年 1 月 1 日（星期六）
    cout << "2000-01-01 星期判定（基姆拉尔森公式，5 代表周六）：" << get_weekday_kim(2000, 1, 1) << endl;
    cout << "2000-01-01 星期判定（蔡勒公式，0 代表周六）：" << get_weekday_zeller(2000, 1, 1) << endl;
    cout << endl;

    // ---- 验证 2：计算大年份天数差（测试 O(1) 天数公式） ----
    // 计算 2000-01-01 到 2024-05-25 的天数差
    long long diff = get_days_between(2000, 1, 1, 2024, 5, 25);
    cout << "2000-01-01 到 2024-05-25 之间的天数差为（应为 8911）：" << diff << endl;
    cout << endl;

    // ---- 验证 3：解决第一站诊断挑战 ----
    // 题目：2000-01-01（周六）到 2025-12-31 中，是星期日且 y+m+d 为偶数的天数（应为 677）
    
    // 【解法 A：使用基姆拉尔森公式 + 双重循环（适用于小数据年份）】
    int ans_formula = 0;
    int days_in_month[13];
    copy(MONTH_DAYS, MONTH_DAYS + 13, days_in_month); // 拷贝常量

    for (int y = 2000; y <= 2025; ++y) {
        days_in_month[2] = is_leap(y) ? 29 : 28; // 动态维护闰年 2 月
        for (int m = 1; m <= 12; ++m) {
            for (int d = 1; d <= days_in_month[m]; ++d) {
                int w = get_weekday_kim(y, m, d);
                if (w == 6 && (y + m + d) % 2 == 0) { // 6 代表星期日
                    ans_formula++;
                }
            }
        }
    }
    cout << "【公式法】诊断挑战统计结果（应为 677）：" << ans_formula << endl;

    // 【解法 B：安全逐天模拟法模板（无需公式，适合处理状态转移极其复杂的细节题）】
    int ans_simulate = 0;
    int y = 2000, m = 1, d = 1;
    int w = 5; // 已知 2000-01-01 是星期六（0-周一, ..., 5-周六, 6-周日）

    while (true) {
        // 条件统计：星期日 且 y+m+d 是偶数
        if (w == 6 && (y + m + d) % 2 == 0) {
            ans_simulate++;
        }

        // 到达边界，退出
        if (y == 2025 && m == 12 && d == 31) {
            break;
        }

        // 维护 2 月天数
        days_in_month[2] = is_leap(y) ? 29 : 28;

        d++;             // 天数自增
        w = (w + 1) % 7; // 星期循环自增

        // 跨月/跨年判定
        if (d > days_in_month[m]) {
            d = 1;
            m++;
            if (m > 12) {
                m = 1;
                y++;
            }
        }
    }
    cout << "【模拟法】诊断挑战统计结果（应为 677）：" << ans_simulate << endl;

    return 0;
}