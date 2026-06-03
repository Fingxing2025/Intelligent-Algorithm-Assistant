window.TEMPLATE_LIBRARY = {
  "generatedAt": "2026-06-03T00:36:35.148Z",
  "total": 65,
  "summary": {
    "基础算法": 5,
    "基础能力": 15,
    "计算几何": 1,
    "总览": 2,
    "其他专题": 1,
    "数据结构": 10,
    "图论": 7,
    "动态规划": 24
  },
  "templates": [
    {
      "id": "二分-二分查找使用示例-cpp",
      "title": "二分查找使用示例",
      "fileName": "二分查找使用示例.cpp",
      "relativePath": "模板库/二分/二分查找使用示例.cpp",
      "originalFolders": [
        "模板库",
        "二分"
      ],
      "layers": [
        "基础算法",
        "二分"
      ],
      "note": "集中管理整数二分、实数二分与二分答案模板。",
      "difficulty": "中级",
      "scenarios": [
        "答案具有单调性",
        "边界定位问题"
      ],
      "signals": [
        "答案范围可枚举",
        "满足性随答案单调变化"
      ],
      "risks": [
        "边界更新不当会死循环",
        "要分清找左边界还是右边界"
      ],
      "keywords": [
        "基础算法",
        "二分",
        "二分查找使用示例",
        "单调性",
        "边界"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tll n, c, ans = 0;\r\n\tcin >> n >> c;\r\n\tvector<ll> a(n);\r\n\tfor (int i = 0; i < n; ++i)\r\n\t\tcin >> a[i];\r\n\tsort(a.begin(), a.end());\r\n\t// 枚举每一种不同的 a[i]，统计满足 a[j]-a[i]=c 的配对数。\r\n\tfor (int i = 0; i < n && a[i] + c <= a[n - 1];)\r\n\t{\r\n\t\t// lower_bound 找到第一个 >= a[i]+c 的位置；\r\n\t\t// 如果这个位置正好等于 a[i]+c，说明目标值存在。\r\n\t\tauto it = lower_bound(a.begin(), a.end(), a[i] + c);\r\n\t\t// upper_bound(a.begin(), a.end(), a[i]) 找到第一个 > a[i] 的位置；\r\n\t\t// 因此 [i, it2) 正好覆盖所有值等于 a[i] 的元素。\r\n\t\tauto it2 = upper_bound(a.begin(), a.end(), a[i]);\r\n\t\t// [it, it1) 是值为 a[i]+c 的区间，[i, it2) 是值为 a[i] 的区间。\r\n\t\tif (*it == a[i] + c)\r\n\t\t{\r\n\t\t\tauto it1 = upper_bound(a.begin(), a.end(), a[i] + c);\r\n\t\t\t// cnt1 是目标值 a[i]+c 出现次数，cnt2 是当前值 a[i] 出现次数。\r\n\t\t\t// 两类元素可以两两配对，所以新增方案数是乘积。\r\n\t\t\tll cnt1 = it1 - it;\r\n\t\t\tll cnt2 = it2 - a.begin() - i;\r\n\t\t\tans += cnt1 * cnt2;\r\n\t\t}\r\n\t\t// 跳过这一整段相同的 a[i]，避免重复统计同一个值。\r\n\t\ti = it2 - a.begin();\r\n\t}\r\n\tcout << ans;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "二分-简单实数二分答案-cpp",
      "title": "简单实数二分答案",
      "fileName": "简单实数二分答案.cpp",
      "relativePath": "模板库/二分/简单实数二分答案.cpp",
      "originalFolders": [
        "模板库",
        "二分"
      ],
      "layers": [
        "基础算法",
        "二分"
      ],
      "note": "集中管理整数二分、实数二分与二分答案模板。",
      "difficulty": "中级",
      "scenarios": [
        "答案具有单调性",
        "边界定位问题"
      ],
      "signals": [
        "答案范围可枚举",
        "满足性随答案单调变化"
      ],
      "risks": [
        "边界更新不当会死循环",
        "要分清找左边界还是右边界"
      ],
      "keywords": [
        "基础算法",
        "二分",
        "简单实数二分答案",
        "单调性",
        "边界"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\ndouble w0, w;\r\nint m;\r\n// 判断月利率为 t 时，连续 m 个月后余额是否仍大于 0。\r\nbool check(double t)\r\n{\r\n\tdouble k = w0;\r\n\tfor (int i = 0; i < m; ++i)\r\n\t{\r\n\t\tk = k + k * t / 100 - w;\r\n\t}\r\n\treturn k > 0;\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tcin >> w0 >> w >> m;\r\n\tdouble l = 0, r = 300;\r\n\t// 实数二分通常用“区间长度足够小”为终止条件。\r\n\twhile (r - l > 1e-3)\r\n\t{\r\n\t\tdouble mid = l + (r - l) / 2;\r\n\t\tif (check(mid))\r\n\t\t\tr = mid;\r\n\t\telse\r\n\t\t\tl = mid;\r\n\t}\r\n\tcout << fixed << setprecision(1) << r;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "二分-简单整数二分答案-cpp",
      "title": "简单整数二分答案",
      "fileName": "简单整数二分答案.cpp",
      "relativePath": "模板库/二分/简单整数二分答案.cpp",
      "originalFolders": [
        "模板库",
        "二分"
      ],
      "layers": [
        "基础算法",
        "二分"
      ],
      "note": "集中管理整数二分、实数二分与二分答案模板。",
      "difficulty": "中级",
      "scenarios": [
        "答案具有单调性",
        "边界定位问题"
      ],
      "signals": [
        "答案范围可枚举",
        "满足性随答案单调变化"
      ],
      "risks": [
        "边界更新不当会死循环",
        "要分清找左边界还是右边界"
      ],
      "keywords": [
        "基础算法",
        "二分",
        "简单整数二分答案",
        "单调性",
        "边界"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nll m;\r\nll a[1000005];\r\nint n;\r\n// 检查把所有树木裁到高度 h 后，能否至少得到 m 的木材。\r\nbool check(int h)\r\n{\r\n\tll ans = 0;\r\n\tfor (int i = 0; i < n; ++i)\r\n\t{\r\n\t\tif (a[i] > h)\r\n\t\t\tans += a[i] - h;\r\n\t}\r\n\treturn ans >= m;\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tcin >> n >> m;\r\n\tll l = 0, r = 0, ans = -1;\r\n\tfor (int i = 0; i < n; ++i)\r\n\t{\r\n\t\tcin >> a[i];\r\n\t\tr = max(r, a[i] + 1);\r\n\t}\r\n\t// 二分“最大可行值”：如果 mid 可行，就继续向右找更高的锯子高度。\r\n\twhile (l <= r)\r\n\t{\r\n\t\tll mid = l + (r - l) / 2;\r\n\t\tif (check(mid))\r\n\t\t{\r\n\t\t\tans = mid;\r\n\t\t\tl = mid + 1;\r\n\t\t}\r\n\t\telse\r\n\t\t\tr = mid - 1;\r\n\t}\r\n\tcout << ans;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-工具与技巧-内存显示-变量在内部的16进制表示-cpp",
      "title": "内存显示（变量在内部的16进制表示）",
      "fileName": "内存显示（变量在内部的16进制表示）.cpp",
      "relativePath": "模板库/基础/工具与技巧/内存显示（变量在内部的16进制表示）.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "工具与技巧"
      ],
      "layers": [
        "基础能力",
        "工具与技巧"
      ],
      "note": "偏向语法技巧、调试方法和通用工具。",
      "difficulty": "基础",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "基础能力",
        "工具与技巧",
        "内存显示（变量在内部的16进制表示）"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nint main()\r\n{\r\n\tstring s;\r\n\twhile (cin >> s)\r\n\t{\r\n\t\t// 这里只是演示“把变量地址按字节解释后输出十六进制”。\r\n\t\t// 常用于观察不同类型在内存中的底层表示，以及机器的字节序。\r\n\t\tbool isdouble = false;\r\n\t\t// 只要字符串里出现小数点，就把它当成 double 处理；\r\n\t\t// 否则按 int 处理。\r\n\t\tfor (int i = 0; i < s.size(); ++i)\r\n\t\t\tif (s[i] == '.')\r\n\t\t\t{\r\n\t\t\t\tisdouble = true;\r\n\t\t\t\tbreak;\r\n\t\t\t}\r\n\t\tif (isdouble)\r\n\t\t{\r\n\t\t\tdouble val = stod(s);\r\n\t\t\t// 把 double 的地址强转成 unsigned char*，\r\n\t\t\t// 这样就能按“一个字节一个字节”去读它在内存中的原始表示。\r\n\t\t\tunsigned char *by = (unsigned char *)(&val);\r\n\t\t\tfor (int i = 0; i < sizeof(double); ++i)\r\n\t\t\t\t// setw(2)+setfill('0') 保证每个字节都以两位十六进制输出。\r\n\t\t\t\tcout << hex << setw(2) << setfill('0') << (int)(by[i]) << \" \";\r\n\t\t\tcout << \"\\n\";\r\n\t\t}\r\n\t\telse\r\n\t\t{\r\n\t\t\tint val = stoi(s);\r\n\t\t\t// int 分支和 double 分支做的是同一件事，只是读取的对象类型不同。\r\n\t\t\tunsigned char *by = (unsigned char *)(&val);\r\n\t\t\tfor (int i = 0; i < sizeof(int); ++i)\r\n\t\t\t\tcout << hex << setw(2) << setfill('0') << (int)(by[i]) << \" \";\r\n\t\t\tcout << \"\\n\";\r\n\t\t}\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-工具与技巧-日期模板-cpp",
      "title": "日期模板",
      "fileName": "日期模板.cpp",
      "relativePath": "模板库/基础/工具与技巧/日期模板.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "工具与技巧"
      ],
      "layers": [
        "基础能力",
        "工具与技巧"
      ],
      "note": "偏向语法技巧、调试方法和通用工具。",
      "difficulty": "基础",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "基础能力",
        "工具与技巧",
        "日期模板"
      ],
      "code": "#include <iostream>\r\n#include <cmath>\r\n#include <algorithm>\r\n\r\nusing namespace std;\r\n\r\n// ============================================================================\r\n// 【第十六/十七届蓝桥杯 C/C++ 大学 A 组常用日期算法模板类】\r\n// ============================================================================\r\nnamespace DateToolkit {\r\n\r\n    // 平年每月天数常量数组（下标 1~12 分别对应 1~12 月）\r\n    const int MONTH_DAYS[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};\r\n\r\n    // 平年每月天数前缀和（month_sum[i] 表示当年 1 月 1 日到第 i 月 1 日前一天的总天数）\r\n    const int MONTH_DAYS_PREFIX[13] = {0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334};\r\n\r\n    // 1. 闰年判定函数（Gregorian历）\r\n    bool is_leap(long long y) {\r\n        return (y % 4 == 0 && y % 100 != 0) || (y % 400 == 0);\r\n    }\r\n\r\n    // 2. 基姆拉尔森星期公式（最推荐，无拆分，0-周一, 6-周日）\r\n    int get_weekday_kim(long long y, int m, int d) {\r\n        if (m == 1 || m == 2) {\r\n            m += 12;\r\n            y--;\r\n        }\r\n        // 注意：C++ 的 % 在处理可能为负数的值时需要特别处理，但本公式中由于 y 和 m 均为正数，不会产生负数\r\n        long long w = (d + 2 * m + 3 * (m + 1) / 5 + y + y / 4 - y / 100 + y / 400) % 7;\r\n        return w; \r\n    }\r\n\r\n    // 3. 蔡勒星期公式（经典款，需要拆分世纪，0-周六, 1-周日, ..., 6-周五）\r\n    int get_weekday_zeller(long long year, int month, int day) {\r\n        if (month == 1 || month == 2) {\r\n            month += 12;\r\n            year--;\r\n        }\r\n        long long c = year / 100;\r\n        long long y = year % 100;\r\n        long long m = month;\r\n        long long d = day;\r\n        \r\n        long long w = d + 26 * (m + 1) / 10 + y + y / 4 + c / 4 - 2 * c;\r\n        return (w % 7 + 7) % 7; // 防止模出负数\r\n    }\r\n\r\n    // 4. 计算当前日期距离公元 1 年 1 月 1 日的总天数（支持最大 10^9 年，O(1) 复杂度）\r\n    long long get_total_days(long long y, int m, int d) {\r\n        long long prev_y = y - 1;\r\n        // 基础年天数 + 累计闰年增加的天数\r\n        long long days = prev_y * 365 + prev_y / 4 - prev_y / 100 + prev_y / 400;\r\n        \r\n        days += MONTH_DAYS_PREFIX[m];\r\n        \r\n        // 当年是闰年且月份过了 2 月，需补上 2 月 29 日这一天\r\n        if (m > 2 && is_leap(y)) {\r\n            days += 1;\r\n        }\r\n        \r\n        days += d;\r\n        return days;\r\n    }\r\n\r\n    // 5. 计算任意两个日期的天数差（支持大年份，O(1) 复杂度）\r\n    long long get_days_between(long long y1, int m1, int d1, long long y2, int m2, int d2) {\r\n        return abs(get_total_days(y2, m2, d2) - get_total_days(y1, m1, d1));\r\n    }\r\n}\r\n\r\n// ============================================================================\r\n// 【主函数：测试与诊断挑战验证】\r\n// ============================================================================\r\nint main() {\r\n    using namespace DateToolkit;\r\n\r\n    // ---- 验证 1：测试星期计算公式的正确性 ----\r\n    // 2000 年 1 月 1 日（星期六）\r\n    cout << \"2000-01-01 星期判定（基姆拉尔森公式，5 代表周六）：\" << get_weekday_kim(2000, 1, 1) << endl;\r\n    cout << \"2000-01-01 星期判定（蔡勒公式，0 代表周六）：\" << get_weekday_zeller(2000, 1, 1) << endl;\r\n    cout << endl;\r\n\r\n    // ---- 验证 2：计算大年份天数差（测试 O(1) 天数公式） ----\r\n    // 计算 2000-01-01 到 2024-05-25 的天数差\r\n    long long diff = get_days_between(2000, 1, 1, 2024, 5, 25);\r\n    cout << \"2000-01-01 到 2024-05-25 之间的天数差为（应为 8911）：\" << diff << endl;\r\n    cout << endl;\r\n\r\n    // ---- 验证 3：解决第一站诊断挑战 ----\r\n    // 题目：2000-01-01（周六）到 2025-12-31 中，是星期日且 y+m+d 为偶数的天数（应为 677）\r\n    \r\n    // 【解法 A：使用基姆拉尔森公式 + 双重循环（适用于小数据年份）】\r\n    int ans_formula = 0;\r\n    int days_in_month[13];\r\n    copy(MONTH_DAYS, MONTH_DAYS + 13, days_in_month); // 拷贝常量\r\n\r\n    for (int y = 2000; y <= 2025; ++y) {\r\n        days_in_month[2] = is_leap(y) ? 29 : 28; // 动态维护闰年 2 月\r\n        for (int m = 1; m <= 12; ++m) {\r\n            for (int d = 1; d <= days_in_month[m]; ++d) {\r\n                int w = get_weekday_kim(y, m, d);\r\n                if (w == 6 && (y + m + d) % 2 == 0) { // 6 代表星期日\r\n                    ans_formula++;\r\n                }\r\n            }\r\n        }\r\n    }\r\n    cout << \"【公式法】诊断挑战统计结果（应为 677）：\" << ans_formula << endl;\r\n\r\n    // 【解法 B：安全逐天模拟法模板（无需公式，适合处理状态转移极其复杂的细节题）】\r\n    int ans_simulate = 0;\r\n    int y = 2000, m = 1, d = 1;\r\n    int w = 5; // 已知 2000-01-01 是星期六（0-周一, ..., 5-周六, 6-周日）\r\n\r\n    while (true) {\r\n        // 条件统计：星期日 且 y+m+d 是偶数\r\n        if (w == 6 && (y + m + d) % 2 == 0) {\r\n            ans_simulate++;\r\n        }\r\n\r\n        // 到达边界，退出\r\n        if (y == 2025 && m == 12 && d == 31) {\r\n            break;\r\n        }\r\n\r\n        // 维护 2 月天数\r\n        days_in_month[2] = is_leap(y) ? 29 : 28;\r\n\r\n        d++;             // 天数自增\r\n        w = (w + 1) % 7; // 星期循环自增\r\n\r\n        // 跨月/跨年判定\r\n        if (d > days_in_month[m]) {\r\n            d = 1;\r\n            m++;\r\n            if (m > 12) {\r\n                m = 1;\r\n                y++;\r\n            }\r\n        }\r\n    }\r\n    cout << \"【模拟法】诊断挑战统计结果（应为 677）：\" << ans_simulate << endl;\r\n\r\n    return 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-工具与技巧-数独模板-cpp",
      "title": "数独模板",
      "fileName": "数独模板.cpp",
      "relativePath": "模板库/基础/工具与技巧/数独模板.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "工具与技巧"
      ],
      "layers": [
        "基础能力",
        "工具与技巧"
      ],
      "note": "偏向语法技巧、调试方法和通用工具。",
      "difficulty": "基础",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "基础能力",
        "工具与技巧",
        "数独模板"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nusing ll=long long;\r\nint row[9],col[9],blk[3][3],m[9][9],ans=-1;\r\nint score[9][9]={\r\n{6,6,6,6,6,6,6,6,6},\r\n{6,7,7,7,7,7,7,7,6},\r\n{6,7,8,8,8,8,8,7,6},\r\n{6,7,8,9,9,9,8,7,6},\r\n{6,7,8,9,10,9,8,7,6},\r\n{6,7,8,9,9,9,8,7,6},\r\n{6,7,8,8,8,8,8,7,6},\r\n{6,7,7,7,7,7,7,7,6},\r\n{6,6,6,6,6,6,6,6,6}};\r\nvoid flip(int r,int c,int val){\r\n\tint bit=1<<(val-1);\r\n\trow[r]^=bit;\r\n\tcol[c]^=bit;\r\n\tblk[r/3][c/3]^=bit;\r\n}\r\nvoid update(){\r\n\tint sum=0;\r\n\tfor(int i=0;i<9;++i)\r\n\t\tfor(int j=0;j<9;++j)\r\n\t\t\tsum+=score[i][j]*m[i][j];\r\n\tans=max(ans,sum);\r\n}\r\nvoid dfs(int cnt){\r\n\tif(cnt==0){\r\n\t\tupdate();\r\n\t\treturn;\r\n\t}\r\n\tint r,c,op=10,p;\r\n\tfor(int i=0;i<9;++i)\r\n\t\tfor(int j=0;j<9;++j)\r\n\t\t\tif(m[i][j]==0){\r\n\t\t\t\tint ps=~(row[i]|col[j]|blk[i/3][j/3])&0x1ff;\r\n\t\t\t\tint ops=0,x=ps;\r\n\t\t\t\twhile(x>0){\r\n\t\t\t\t\tops+=x&1;\r\n\t\t\t\t\tx>>=1;\r\n\t\t\t\t}\r\n\t\t\t\tif(ops==0) return;\r\n\t\t\t\tif(ops<op){\r\n\t\t\t\t\top=ops; p=ps;\r\n\t\t\t\t\tr=i; c=j;\r\n\t\t\t\t}\r\n\t\t\t}\r\n\twhile(p>0){\r\n\t\tint val=1,x=p;\r\n\t\twhile(!(x&1)){\r\n\t\t\t++val;\r\n\t\t\tx>>=1;\r\n\t\t}\r\n\t\tm[r][c]=val;\r\n\t\tflip(r,c,val);\r\n\t\tdfs(cnt-1);\r\n\t\tflip(r,c,val);\r\n\t\tm[r][c]=0;\r\n\t\tp&=p-1;\r\n\t}\r\n}\r\nint main(){\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tint cnt=0;\r\n\tfor(int i=0;i<9;++i)\r\n\t\tfor(int j=0;j<9;++j){\r\n\t\t\tcin>>m[i][j];\r\n\t\t\tif(m[i][j]!=0) flip(i,j,m[i][j]);\r\n\t\t\telse ++cnt;\r\n\t\t}\r\n\tdfs(cnt);\r\n\tcout<<ans;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-工具与技巧-sort排序lambda-cpp",
      "title": "sort排序lambda",
      "fileName": "sort排序lambda.cpp",
      "relativePath": "模板库/基础/工具与技巧/sort排序lambda.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "工具与技巧"
      ],
      "layers": [
        "基础能力",
        "工具与技巧"
      ],
      "note": "偏向语法技巧、调试方法和通用工具。",
      "difficulty": "基础",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "基础能力",
        "工具与技巧",
        "sort排序lambda"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tvector<int> v = {10, 20, 30, 40, 50};\r\n\tint target = 25; // 外部变量\r\n\r\n\t// [&](...) 表示按引用捕获外部变量，因此比较函数里可以直接使用 target。\r\n\t// 这里的排序规则不是按数值本身从小到大，而是按“离 target 的距离”从近到远。\r\n\t// 也就是说，比较函数返回 true 的条件是：a 比 b 更应该排在前面。\r\n\tsort(v.begin(), v.end(), [&](int a, int b)\r\n\t\t { return abs(a - target) < abs(b - target); });\r\n\t// 排序后，离 25 越近的数会越靠前。\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-数学与精度-高精度类-cpp",
      "title": "高精度类",
      "fileName": "高精度类.cpp",
      "relativePath": "模板库/基础/数学与精度/高精度类.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "数学与精度"
      ],
      "layers": [
        "基础能力",
        "数学与精度"
      ],
      "note": "适合处理精度、数论、数值计算等基础问题。",
      "difficulty": "基础",
      "scenarios": [
        "数值计算",
        "精度或数学优化"
      ],
      "signals": [
        "数值范围大",
        "普通整型或暴力不够用"
      ],
      "risks": [
        "精度与溢出要优先检查",
        "公式推导错比实现错更隐蔽"
      ],
      "keywords": [
        "基础能力",
        "数学与精度",
        "高精度类"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst ll Mod = 998244353;\r\nclass MyBigInteger\r\n{\r\nprivate:\r\n\tstring a;\r\n\tstring b;\r\n\tchar op;\r\n\t// 把字符串转成倒序数位数组，便于从低位到高位处理。\r\n\tvector<int> trans(const string &x)\r\n\t{\r\n\t\tvector<int> ans;\r\n\t\tfor (int i = x.size() - 1; i >= 0; --i)\r\n\t\t\tans.push_back(x[i] - '0');\r\n\t\treturn ans;\r\n\t}\r\n\t// 比较两个非负高精度数的大小，返回 a >= b 是否成立。\r\n\tbool cmp(vector<int> &a, vector<int> &b)\r\n\t{\r\n\t\tif (a.size() != b.size())\r\n\t\t\treturn a.size() > b.size();\r\n\t\tfor (int i = a.size() - 1; i >= 0; --i)\r\n\t\t\tif (a[i] != b[i])\r\n\t\t\t\treturn a[i] > b[i];\r\n\t\treturn true;\r\n\t}\r\n\t// 把倒序数位数组还原成正常顺序的字符串。\r\n\tstring invtrans(const vector<int> &c)\r\n\t{\r\n\t\tstring s;\r\n\t\tfor (int i = c.size() - 1; i >= 0; --i)\r\n\t\t\ts.push_back(c[i] + '0');\r\n\t\treturn s;\r\n\t}\r\n\t// 高精度加法，同时兼容带符号的情况。\r\n\tstring Plus(string a, string b)\r\n\t{\r\n\t\tif (a[0] != '-' && b[0] != '-')\r\n\t\t{\r\n\t\t\tvector<int> x = trans(a);\r\n\t\t\tvector<int> y = trans(b);\r\n\t\t\tvector<int> c;\r\n\t\t\tint t = 0;\r\n\t\t\tfor (int i = 0; i < x.size() || i < y.size(); ++i)\r\n\t\t\t{\r\n\t\t\t\t// t 先带着上一位的进位进入当前位，再把两数当前位加上。\r\n\t\t\t\tif (i < x.size())\r\n\t\t\t\t\tt += x[i];\r\n\t\t\t\tif (i < y.size())\r\n\t\t\t\t\tt += y[i];\r\n\t\t\t\t// 当前位保留个位，十位及以上留给下一轮作为进位。\r\n\t\t\t\tc.push_back(t % 10);\r\n\t\t\t\tt /= 10;\r\n\t\t\t}\r\n\t\t\tif (t)\r\n\t\t\t\tc.push_back(1);\r\n\t\t\treturn invtrans(c);\r\n\t\t}\r\n\t\t// (-a)+b 等价于 b-a。\r\n\t\telse if (a[0] == '-' && b[0] != '-')\r\n\t\t\treturn Minus(b, a.substr(1));\r\n\t\t// a+(-b) 等价于 a-b。\r\n\t\telse if (a[0] != '-' && b[0] == '-')\r\n\t\t\treturn Minus(a, b.substr(1));\r\n\t\t// (-a)+(-b) 等价于 -(a+b)。\r\n\t\telse\r\n\t\t\treturn \"-\" + Plus(a.substr(1), b.substr(1));\r\n\t}\r\n\t// 高精度减法，同时兼容带符号的情况。\r\n\tstring Minus(string a, string b)\r\n\t{\r\n\t\tif (a[0] != '-' && b[0] != '-')\r\n\t\t{\r\n\t\t\tvector<int> x = trans(a);\r\n\t\t\tvector<int> y = trans(b);\r\n\t\t\tbool flag = cmp(x, y);\r\n\t\t\t// 为了统一处理，先保证 x >= y；\r\n\t\t\t// 若原本 a < b，最后再把负号补回去。\r\n\t\t\tif (!flag)\r\n\t\t\t\tswap(x, y);\r\n\t\t\tvector<int> c;\r\n\t\t\tint t = 0;\r\n\t\t\tfor (int i = 0; i < x.size(); ++i)\r\n\t\t\t{\r\n\t\t\t\t// t 在这里表示“上一位是否向当前位借了 1”。\r\n\t\t\t\tt = x[i] - t;\r\n\t\t\t\tif (i < y.size())\r\n\t\t\t\t\tt -= y[i];\r\n\t\t\t\t// (t+10)%10 能统一处理当前位够减和不够减两种情况。\r\n\t\t\t\tc.push_back((t + 10) % 10);\r\n\t\t\t\t// 若不够减，则下一位还要继续借 1。\r\n\t\t\t\tif (t < 0)\r\n\t\t\t\t\tt = 1;\r\n\t\t\t\telse\r\n\t\t\t\t\tt = 0;\r\n\t\t\t}\r\n\t\t\twhile (c.size() > 1 && c.back() == 0)\r\n\t\t\t\tc.pop_back();\r\n\t\t\t// 若结果本身就是 0，就不要保留负号。\r\n\t\t\tif (c.size() == 1 && c[0] == 0)\r\n\t\t\t\tflag = true;\r\n\t\t\treturn flag ? invtrans(c) : \"-\" + invtrans(c);\r\n\t\t}\r\n\t\t// a-(-b) 等价于 a+b。\r\n\t\telse if (a[0] != '-' && b[0] == '-')\r\n\t\t\treturn Plus(a, b.substr(1));\r\n\t\t// (-a)-b 等价于 -(a+b)。\r\n\t\telse if (a[0] == '-' && b[0] != '-')\r\n\t\t\treturn \"-\" + Plus(a.substr(1), b);\r\n\t\t// (-a)-(-b) 等价于 b-a。\r\n\t\telse\r\n\t\t\treturn Minus(b.substr(1), a.substr(1));\r\n\t}\r\n\t// 高精度乘法：按竖式乘法模拟。\r\n\tstring Times(string a, string b)\r\n\t{\r\n\t\tbool flag = false;\r\n\t\tif (a[0] == '-')\r\n\t\t{\r\n\t\t\ta = a.substr(1);\r\n\t\t\tflag = !flag;\r\n\t\t}\r\n\t\tif (b[0] == '-')\r\n\t\t{\r\n\t\t\tb = b.substr(1);\r\n\t\t\tflag = !flag;\r\n\t\t}\r\n\t\tvector<int> x = trans(a);\r\n\t\tvector<int> y = trans(b);\r\n\t\tvector<int> c(x.size() + y.size() + 1);\r\n\t\tfor (int i = 0; i < x.size(); ++i)\r\n\t\t\tfor (int j = 0; j < y.size(); ++j)\r\n\t\t\t\t// 第 i 位与第 j 位相乘，会累计到结果的第 i+j 位。\r\n\t\t\t\tc[i + j] += x[i] * y[j];\r\n\t\tint t = 0;\r\n\t\tfor (int i = 0; i < c.size(); ++i)\r\n\t\t{\r\n\t\t\t// 把这一位累计的值和前面传下来的进位一起结算。\r\n\t\t\tt += c[i];\r\n\t\t\tc[i] = t % 10;\r\n\t\t\tt /= 10;\r\n\t\t}\r\n\t\twhile (c.size() > 1 && c.back() == 0)\r\n\t\t\tc.pop_back();\r\n\t\tif (c.size() == 1 && c[0] == 0)\r\n\t\t\tflag = false;\r\n\t\treturn flag ? \"-\" + invtrans(c) : invtrans(c);\r\n\t}\r\n\t// 高精度除法：朴素做法，适合模板复习，不适合特别大的数据范围。\r\n\tstring Div(string a, string b)\r\n\t{\r\n\t\tbool flag = false;\r\n\t\tif (a[0] == '-')\r\n\t\t{\r\n\t\t\ta = a.substr(1);\r\n\t\t\tflag = !flag;\r\n\t\t}\r\n\t\tif (b[0] == '-')\r\n\t\t{\r\n\t\t\tb = b.substr(1);\r\n\t\t\tflag = !flag;\r\n\t\t}\r\n\t\tif (b == \"0\" || b == \"\")\r\n\t\t\treturn \"0\";\r\n\t\tvector<int> x = trans(a);\r\n\t\tvector<int> y = trans(b);\r\n\t\t// 若被除数还比除数小，商直接为 0。\r\n\t\tif (!cmp(x, y))\r\n\t\t\treturn \"0\";\r\n\t\tvector<int> c;\r\n\t\tint extra = x.size() - y.size();\r\n\t\t// 先把除数补零到和被除数同长度，后面再逐位右移试商。\r\n\t\ty.insert(y.begin(), extra, 0);\r\n\t\tfor (int i = 0; i <= extra; ++i)\r\n\t\t{\r\n\t\t\tint q = 0;\r\n\t\t\t// 当前位商的定义，就是“对齐后的除数还能从被除数里减去几次”。\r\n\t\t\twhile (cmp(x, y))\r\n\t\t\t{\r\n\t\t\t\tstring str_x = invtrans(x);\r\n\t\t\t\tstring str_y = invtrans(y);\r\n\t\t\t\tstring res = Minus(str_x, str_y);\r\n\t\t\t\tx = trans(res);\r\n\t\t\t\tq++;\r\n\t\t\t}\r\n\t\t\tc.push_back(q);\r\n\t\t\tif (!y.empty())\r\n\t\t\t\t// 去掉最低位对齐补的 0，相当于把除数整体右移一位。\r\n\t\t\t\ty.erase(y.begin());\r\n\t\t}\r\n\t\treverse(c.begin(), c.end());\r\n\t\twhile (c.size() > 1 && c.back() == 0)\r\n\t\t\tc.pop_back();\r\n\t\tif (c.size() == 1 && c[0] == 0)\r\n\t\t\tflag = false;\r\n\t\treturn flag ? \"-\" + invtrans(c) : invtrans(c);\r\n\t}\r\n\r\npublic:\r\n\tMyBigInteger(string &x, string &y, char &p) : a(x), b(y), op(p) {};\r\n\t// 根据运算符分发到对应运算。\r\n\tstring cal()\r\n\t{\r\n\t\t// 这里就是一个统一调度层：根据运算符把请求分发给对应函数。\r\n\t\tif (op == '+')\r\n\t\t\treturn Plus(a, b);\r\n\t\tif (op == '-')\r\n\t\t\treturn Minus(a, b);\r\n\t\tif (op == '*')\r\n\t\t\treturn Times(a, b);\r\n\t\tif (op == '/')\r\n\t\t\treturn Div(a, b);\r\n\t}\r\n};\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tstring a, b;\r\n\tchar op;\r\n\tcin >> a >> b >> op;\r\n\tMyBigInteger t(a, b, op);\r\n\tcout << t.cal();\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-数学与精度-高精度运算-cpp",
      "title": "高精度运算",
      "fileName": "高精度运算.cpp",
      "relativePath": "模板库/基础/数学与精度/高精度运算.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "数学与精度"
      ],
      "layers": [
        "基础能力",
        "数学与精度"
      ],
      "note": "适合处理精度、数论、数值计算等基础问题。",
      "difficulty": "基础",
      "scenarios": [
        "数值计算",
        "精度或数学优化"
      ],
      "signals": [
        "数值范围大",
        "普通整型或暴力不够用"
      ],
      "risks": [
        "精度与溢出要优先检查",
        "公式推导错比实现错更隐蔽"
      ],
      "keywords": [
        "基础能力",
        "数学与精度",
        "高精度运算"
      ],
      "code": "#include <iostream>\r\n#include <vector>\r\n#include <string>\r\n#include <algorithm> // 用于 reverse\r\nusing namespace std;\r\n\r\n// 这些高精度函数都采用“低位在前”的 vector<int> 存储方式。\r\n// ==========================================\r\n// 0. 辅助函数：比较 A 是否大于等于 B\r\n// ==========================================\r\nbool cmp(vector<int> &A, vector<int> &B)\r\n{\r\n    // 位数不同，位数更长的数一定更大。\r\n    if (A.size() != B.size())\r\n        return A.size() > B.size();\r\n    // 位数相同时，从最高位往低位逐位比较。\r\n    for (int i = A.size() - 1; i >= 0; i--)\r\n    {\r\n        if (A[i] != B[i])\r\n            return A[i] > B[i];\r\n    }\r\n    return true; // A == B 时也返回 true\r\n}\r\n\r\n// ==========================================\r\n// 1. 高精度加法 (A + B)\r\n// ==========================================\r\nvector<int> add(vector<int> &A, vector<int> &B)\r\n{\r\n    vector<int> C;\r\n    int t = 0; // 进位\r\n    for (int i = 0; i < A.size() || i < B.size(); i++)\r\n    {\r\n        // t 在进入这一轮时，先携带上一次留下来的进位。\r\n        if (i < A.size())\r\n            t += A[i];\r\n        if (i < B.size())\r\n            t += B[i];\r\n        // 当前位存个位，十位及以上继续作为下一轮的进位。\r\n        C.push_back(t % 10);\r\n        t /= 10;\r\n    }\r\n    // 最后一轮若还有进位，就补成新的最高位。\r\n    if (t)\r\n        C.push_back(1);\r\n    return C;\r\n}\r\n\r\n// ==========================================\r\n// 2. 高精度减法 (A - B) -> 前提保证 A >= B\r\n// ==========================================\r\nvector<int> sub(vector<int> &A, vector<int> &B)\r\n{\r\n    vector<int> C;\r\n    int t = 0; // 借位\r\n    for (int i = 0; i < A.size(); i++)\r\n    {\r\n        // t 此时只会是 0 或 1，表示上一位是否向当前位借过 1。\r\n        t = A[i] - t;\r\n        if (i < B.size())\r\n            t -= B[i];\r\n        // (t+10)%10 统一处理“够减”和“不够减”两种情况，得到当前位结果。\r\n        C.push_back((t + 10) % 10);\r\n        // 若当前位不够减，说明下一位还得继续借 1。\r\n        if (t < 0)\r\n            t = 1;\r\n        else\r\n            t = 0;\r\n    }\r\n    // 去除前导零\r\n    while (C.size() > 1 && C.back() == 0)\r\n        C.pop_back();\r\n    return C;\r\n}\r\n\r\n// ==========================================\r\n// 3. 高精度乘法 (A * B)\r\n// ==========================================\r\n// 高精度加法。\r\nvector<int> mul(vector<int> &A, vector<int> &B)\r\n{\r\n    vector<int> C(A.size() + B.size(), 0);\r\n    for (int i = 0; i < A.size(); i++)\r\n    {\r\n        for (int j = 0; j < B.size(); j++)\r\n        {\r\n            // A[i] 与 B[j] 的乘积，会落到结果的第 i+j 位上。\r\n            C[i + j] += A[i] * B[j];\r\n        }\r\n    }\r\n    int t = 0;\r\n    for (int i = 0; i < C.size(); i++)\r\n    {\r\n        // 把前面累计在这一位上的值和进位一起结算。\r\n        t += C[i];\r\n        C[i] = t % 10;\r\n        t /= 10;\r\n    }\r\n    while (C.size() > 1 && C.back() == 0)\r\n        C.pop_back();\r\n    return C;\r\n}\r\n// 高精度减法，使用前要保证 A >= B。\r\n\r\n// ==========================================\r\n// 4. 高精度 除以 低精度 (A / b) -> b 是普通 int\r\n// ==========================================\r\nvector<int> div_low(vector<int> &A, int b, int &r)\r\n{\r\n    vector<int> C;\r\n    r = 0;\r\n    // 从高位开始\r\n    for (int i = A.size() - 1; i >= 0; i--)\r\n    {\r\n        // 把余数左移一位，再拼上当前数字，模拟手算长除法。\r\n        r = r * 10 + A[i];\r\n        C.push_back(r / b);\r\n        // 当前位商写下后，剩下的就是下一位要继续往下带的余数。\r\n        r %= b;\r\n    }\r\n    reverse(C.begin(), C.end()); // 翻转以统一格式\r\n    while (C.size() > 1 && C.back() == 0)\r\n        C.pop_back();\r\n    return C;\r\n}\r\n\r\n// 高精度乘法：朴素竖式乘法。\r\n// ==========================================\r\n// 5. 高精度 除以 高精度 (A / B)\r\n// 注意：参数 A 传值而不是引用，因为内部要不断改变 A 的值\r\n// ==========================================\r\nvector<int> div_high(vector<int> A, vector<int> &B, vector<int> &R)\r\n{\r\n    vector<int> C;\r\n    if (!cmp(A, B))\r\n    { // A < B，商 0 余 A\r\n        R = A;\r\n        C.push_back(0);\r\n        return C;\r\n    }\r\n\r\n    int len_diff = A.size() - B.size();\r\n    vector<int> B_shifted = B;\r\n    // B 后面补 0对齐\r\n    B_shifted.insert(B_shifted.begin(), len_diff, 0);\r\n\r\n    for (int i = 0; i <= len_diff; i++)\r\n    {\r\n        int q = 0; // 当前位的商\r\n        // 当前位置的商，就是“当前对齐后的除数还能从 A 里减掉多少次”。\r\n        while (cmp(A, B_shifted))\r\n        {\r\n            A = sub(A, B_shifted); // 疯狂相减\r\n            q++;\r\n        }\r\n        C.push_back(q);\r\n        if (!B_shifted.empty())\r\n        {\r\n            // 去掉一位 0，相当于把除数整体右移一位，开始试商下一位。\r\n            B_shifted.erase(B_shifted.begin()); // 删掉开头的 0，右移一位\r\n        }\r\n    }\r\n\r\n    reverse(C.begin(), C.end());\r\n    while (C.size() > 1 && C.back() == 0)\r\n        C.pop_back();\r\n    R = A; // A 被减剩下的就是余数\r\n    return C;\r\n}\r\n\r\n// ==========================================\r\n// 统一的输出函数\r\n// 高精度除以高精度，R 返回余数。\r\n// ==========================================\r\nvoid print(const vector<int> &C)\r\n{\r\n    if (C.empty())\r\n    {\r\n        cout << 0 << endl;\r\n        return;\r\n    }\r\n    for (int i = C.size() - 1; i >= 0; i--)\r\n    {\r\n        cout << C[i];\r\n    }\r\n    cout << endl;\r\n}\r\n\r\n// ==========================================\r\n// 主函数示例：测试输入与调用\r\n// ==========================================\r\nint main()\r\n{\r\n    // 假设读入两个大整数 A 和 B\r\n    string str_a = \"12345678901234567890\"; // 被除数 / 操作数1\r\n    string str_b = \"987654321098765432\";   // 除数 / 操作数2\r\n\r\n    vector<int> A, B;\r\n    // 输入字符串转倒序数位数组，统一成前面所有函数使用的格式。\r\n    for (int i = str_a.size() - 1; i >= 0; i--)\r\n        A.push_back(str_a[i] - '0');\r\n    for (int i = str_b.size() - 1; i >= 0; i--)\r\n        B.push_back(str_b[i] - '0');\r\n\r\n    // 1. 加法\r\n    cout << \"A + B = \";\r\n    print(add(A, B));\r\n\r\n    // 2. 减法\r\n    cout << \"A - B = \";\r\n    if (cmp(A, B))\r\n        print(sub(A, B));\r\n    else\r\n    {\r\n        cout << \"-\";\r\n        print(sub(B, A));\r\n    }\r\n\r\n    // 3. 乘法\r\n    // 统一输出高精度结果。\r\n    cout << \"A * B = \";\r\n    print(mul(A, B));\r\n\r\n    // 4. 高精除低精\r\n    int low_b = 12345;\r\n    int r_low = 0;\r\n    vector<int> C_low = div_low(A, low_b, r_low);\r\n    cout << \"A / \" << low_b << \" = \";\r\n    print(C_low);\r\n    cout << \"余数(低精) = \" << r_low << endl;\r\n\r\n    // 5. 高精除高精\r\n    vector<int> R_high; // 高精度余数\r\n    vector<int> C_high = div_high(A, B, R_high);\r\n    cout << \"A / B = \";\r\n    print(C_high);\r\n    cout << \"余数(高精) = \";\r\n    print(R_high);\r\n\r\n    return 0;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-数学与精度-解三角形-cpp",
      "title": "解三角形",
      "fileName": "解三角形.cpp",
      "relativePath": "模板库/基础/数学与精度/解三角形.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "数学与精度"
      ],
      "layers": [
        "基础能力",
        "数学与精度"
      ],
      "note": "适合处理精度、数论、数值计算等基础问题。",
      "difficulty": "基础",
      "scenarios": [
        "数值计算",
        "精度或数学优化"
      ],
      "signals": [
        "数值范围大",
        "普通整型或暴力不够用"
      ],
      "risks": [
        "精度与溢出要优先检查",
        "公式推导错比实现错更隐蔽"
      ],
      "keywords": [
        "基础能力",
        "数学与精度",
        "解三角形"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nconst double PI = acos(-1.0);\r\n// 浮点比较时给一个容错范围，避免精度误差带来的误判。\r\nbool eq(double x, double y)\r\n{\r\n    return fabs(x - y) <= 1e-6 * max({1.0, x, y});\r\n}\r\nint main()\r\n{\r\n    ios_base::sync_with_stdio(false);\r\n    cin.tie(nullptr);\r\n    int T;\r\n    if (cin >> T)\r\n    {\r\n        while (T--)\r\n        {\r\n            vector<double> raw_values(6);\r\n            // 输入按“边,角,边,角,边,角”的顺序给出。\r\n            // 题目里用负数表示未知量，这里统一转成 -1 作为“未填写”的标记。\r\n            for (int i = 0; i < 6; ++i)\r\n            {\r\n                cin >> raw_values[i];\r\n                if (raw_values[i] < 0)\r\n                    raw_values[i] = -1.0;\r\n            }\r\n            // sides 存三条边，angles 存三条边对应的对角，方便后面直接按“三元组”处理。\r\n            vector<double> sides = {raw_values[0], raw_values[2], raw_values[4]};\r\n            vector<double> angles = {raw_values[1], raw_values[3], raw_values[5]};\r\n            try\r\n            {\r\n                int known_side_count = 0, known_angle_count = 0;\r\n                // 统计当前已知了几条边、几个角。\r\n                // 后面的分支逻辑完全依赖这两个计数来判断属于哪种解三角形情形。\r\n                for (int i = 0; i < 3; ++i)\r\n                {\r\n                    if (sides[i] != -1)\r\n                        known_side_count++;\r\n                    if (angles[i] != -1)\r\n                        known_angle_count++;\r\n                }\r\n                // 角已知至少两个时，可以先利用内角和补出第三角，\r\n                // 再配合正弦定理把其他边求出来。\r\n                if (known_angle_count >= 2)\r\n                {\r\n                    // 只知道角而完全不知道边时，三角形只确定形状不确定大小，无法唯一确定。\r\n                    if (known_side_count < 1)\r\n                        throw 1;\r\n                    double known_angle_sum = 0;\r\n                    int missing_angle_index = -1;\r\n                    // 把已知角累加起来，并记录哪个角是缺失的。\r\n                    for (int i = 0; i < 3; ++i)\r\n                    {\r\n                        if (angles[i] == -1)\r\n                            missing_angle_index = i;\r\n                        else\r\n                            known_angle_sum += angles[i];\r\n                    }\r\n                    // 若只缺一个角，直接用内角和补出来。\r\n                    if (missing_angle_index != -1)\r\n                        angles[missing_angle_index] = PI - known_angle_sum;\r\n                    // 三角形三个内角之和必须为 PI，否则输入本身矛盾。\r\n                    known_angle_sum = angles[0] + angles[1] + angles[2];\r\n                    if (!eq(known_angle_sum, PI))\r\n                        throw 1;\r\n                    // 每个内角都必须严格在 (0, PI) 内。\r\n                    for (int i = 0; i < 3; ++i)\r\n                        if (angles[i] <= 0 || angles[i] >= PI)\r\n                            throw 1;\r\n                    double sine_rule_ratio = 0;\r\n                    // 任选一组“已知边 + 对角”，先把正弦定理里的公共比值 a/sin(A) 定下来。\r\n                    for (int i = 0; i < 3; ++i)\r\n                    {\r\n                        if (sides[i] != -1)\r\n                        {\r\n                            sine_rule_ratio = sides[i] / sin(angles[i]);\r\n                            break;\r\n                        }\r\n                    }\r\n                    // 用同一个比例恢复其余边；\r\n                    // 如果某条边原本已知，就顺便校验它是否与正弦定理一致。\r\n                    for (int i = 0; i < 3; ++i)\r\n                    {\r\n                        double calculated_side = sine_rule_ratio * sin(angles[i]);\r\n                        if (sides[i] == -1)\r\n                            sides[i] = calculated_side;\r\n                        if (!eq(sides[i], calculated_side))\r\n                            throw 1;\r\n                    }\r\n                }\r\n                else\r\n                {\r\n                    // 如果角信息不够，则总信息量至少要达到 3 个。\r\n                    // 否则连三角形都无法唯一确定，直接判无效。\r\n                    if (known_angle_count + known_side_count < 3)\r\n                        throw 1;\r\n                }\r\n                // 两边一角时，需要区分已知角是不是夹角。\r\n                if (known_side_count == 2 && known_angle_count == 1)\r\n                {\r\n                    int missing_side_index = -1, known_angle_index = 0;\r\n                    // missing_side_index 表示未知边的下标；\r\n                    // known_angle_index 表示唯一已知角的下标。\r\n                    for (int side_index = 0; side_index < 3; ++side_index)\r\n                        if (sides[side_index] == -1)\r\n                            missing_side_index = side_index;\r\n                    while (angles[known_angle_index] == -1)\r\n                        known_angle_index++;\r\n                    if (missing_side_index == known_angle_index)\r\n                    {\r\n                        // i == j 说明已知角正好夹在另外两条已知边之间，属于 SAS。\r\n                        // 直接用余弦定理求第三边。\r\n                        int left_side_index = (missing_side_index + 1) % 3;\r\n                        int right_side_index = (missing_side_index + 2) % 3;\r\n                        sides[missing_side_index] = sqrt(max(0.0, sides[left_side_index] * sides[left_side_index] + sides[right_side_index] * sides[right_side_index] - 2 * sides[left_side_index] * sides[right_side_index] * cos(angles[missing_side_index])));\r\n                    }\r\n                    else\r\n                    {\r\n                        // i != j 说明已知角不是夹角，属于 SSA。\r\n                        // 这是最容易出现“无解 / 两解 / 一解”的分支。\r\n                        // 这里的下标关系是：\r\n                        // j 对应已知角，j 对边 sd[j] 也是已知；\r\n                        // k 是与已知角相邻的另一条已知边；\r\n                        // i 是待求的第三边。\r\n                        int adjacent_known_side_index = 3 - missing_side_index - known_angle_index;\r\n                        // height_from_known_angle = 已知边[k] * sin(已知角[j])，\r\n                        // 它对应从已知角向对边作高时得到的“高”的长度。\r\n                        double height_from_known_angle = sides[adjacent_known_side_index] * sin(angles[known_angle_index]);\r\n                        if (eq(sides[known_angle_index], height_from_known_angle))\r\n                        {\r\n                            // 恰好等于高，说明构成直角三角形，解唯一。\r\n                            sides[missing_side_index] = sqrt(max(0.0, sides[adjacent_known_side_index] * sides[adjacent_known_side_index] - sides[known_angle_index] * sides[known_angle_index]));\r\n                        }\r\n                        else if (sides[known_angle_index] < height_from_known_angle)\r\n                            // 已知对边比高还短，连三角形都搭不出来。\r\n                            throw 1;\r\n                        else if (sides[known_angle_index] < sides[adjacent_known_side_index])\r\n                            // 对边长介于高和邻边之间时，会出现经典的 SSA 两解情形。\r\n                            throw 2;\r\n                        else\r\n                            // 只剩唯一解时，按几何关系求出第三边。\r\n                            // 这里等价于先求投影，再补上剩余那一段。\r\n                            sides[missing_side_index] = sides[adjacent_known_side_index] * cos(angles[known_angle_index]) + sqrt(max(0.0, sides[adjacent_known_side_index] * sides[adjacent_known_side_index] * (cos(angles[known_angle_index]) * cos(angles[known_angle_index]) - 1) + sides[known_angle_index] * sides[known_angle_index]));\r\n                    }\r\n                    // 进入这里后，三条边都已经凑齐，后面就能统一按 SSS 回推角。\r\n                    known_side_count = 3;\r\n                }\r\n                // 三边已知后，使用余弦定理反推三个角。\r\n                if (known_side_count == 3)\r\n                {\r\n                    double side_sum = sides[0] + sides[1] + sides[2];\r\n                    // 先做三角形存在性判断：任意一边都必须小于另外两边之和。\r\n                    for (int side_index = 0; side_index < 3; ++side_index)\r\n                        if (sides[side_index] * 2 >= side_sum)\r\n                            throw 1;\r\n                    for (int i = 0; i < 3; ++i)\r\n                    {\r\n                        int j = (i + 1) % 3, k = (i + 2) % 3;\r\n                        // 余弦定理：\r\n                        // cos(A_i) = (b^2 + c^2 - a^2) / (2bc)\r\n                        double cosine_value = (sides[j] * sides[j] + sides[k] * sides[k] - sides[i] * sides[i]) / (2 * sides[j] * sides[k]);\r\n                        // 浮点误差可能把值抖到 [-1,1] 外一点点，先钳回合法范围再 acos。\r\n                        if (cosine_value < -1.0)\r\n                            cosine_value = -1.0;\r\n                        if (cosine_value > 1.0)\r\n                            cosine_value = 1.0;\r\n                        double calculated_angle = acos(cosine_value);\r\n                        // 如果这个角原本未知，就直接补上；\r\n                        // 如果原本已知，就检查它是否和三边推出来的结果一致。\r\n                        if (angles[i] == -1)\r\n                            angles[i] = calculated_angle;\r\n                        if (!eq(angles[i], calculated_angle))\r\n                            throw 1;\r\n                    }\r\n                }\r\n            }\r\n            catch (int e)\r\n            {\r\n                // e == 1 表示输入矛盾或根本不能构成三角形；\r\n                // e == 2 表示出现两组合法解，无法唯一确定。\r\n                if (e == 1)\r\n                    cout << \"Invalid input.\\n\";\r\n                else\r\n                    cout << \"More than one solution.\\n\";\r\n                continue;\r\n            }\r\n            // 统一输出三组“边 + 对角”，保留 6 位小数。\r\n            cout << fixed << setprecision(6) << sides[0] << \" \" << angles[0] << \" \" << sides[1] << \" \" << angles[1] << \" \" << sides[2] << \" \" << angles[2] << \"\\n\";\r\n        }\r\n    }\r\n    return 0;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-数学与精度-实数三分-cpp",
      "title": "实数三分",
      "fileName": "实数三分.cpp",
      "relativePath": "模板库/基础/数学与精度/实数三分.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "数学与精度"
      ],
      "layers": [
        "基础能力",
        "数学与精度"
      ],
      "note": "适合处理精度、数论、数值计算等基础问题。",
      "difficulty": "基础",
      "scenarios": [
        "数值计算",
        "精度或数学优化"
      ],
      "signals": [
        "数值范围大",
        "普通整型或暴力不够用"
      ],
      "risks": [
        "精度与溢出要优先检查",
        "公式推导错比实现错更隐蔽"
      ],
      "keywords": [
        "基础能力",
        "数学与精度",
        "实数三分"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst double eps=1e-6;\r\nint n;\r\ndouble a[15];\r\ndouble f(double x){\r\n\tdouble sum=0;\r\n\tfor(int i=n;i>=0;--i) sum=sum*x+a[i];\r\n\treturn sum;\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tdouble l,r;\r\n\tcin>>n>>l>>r;\r\n\tfor(int i=n;i>=0;--i)\r\n\t\tcin>>a[i];\r\n\twhile(r-l>=eps){\r\n\t\tdouble k=(r-l)/3.0;\r\n\t\tdouble m1=l+k,m2=r-k;\r\n\t\tif(f(m1)>f(m2)) r=m2;\r\n\t\telse l=m1;\r\n\t}\r\n\tcout<<fixed<<setprecision(5)<<l;\r\n}\r\n//枚举，求导二分，优选法",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-数学与精度-数学部分-cpp",
      "title": "数学部分",
      "fileName": "数学部分.cpp",
      "relativePath": "模板库/基础/数学与精度/数学部分.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "数学与精度"
      ],
      "layers": [
        "基础能力",
        "数学与精度"
      ],
      "note": "适合处理精度、数论、数值计算等基础问题。",
      "difficulty": "基础",
      "scenarios": [
        "数值计算",
        "精度或数学优化"
      ],
      "signals": [
        "数值范围大",
        "普通整型或暴力不够用"
      ],
      "risks": [
        "精度与溢出要优先检查",
        "公式推导错比实现错更隐蔽"
      ],
      "keywords": [
        "基础能力",
        "数学与精度",
        "数学部分"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst ll Mod = 998244353;\r\n\r\n// 最大公约数。\r\nll gcd(ll a, ll b)\r\n{ // 最大公约数\r\n\t// 欧几里得算法：gcd(a,b)=gcd(b,a mod b)。\r\n\t// 当 b 变成 0 时，当前的 a 就是答案。\r\n\treturn b == 0 ? a : gcd(b, a % b);\r\n}\r\n// 最小公倍数。\r\nll lcm(ll a, ll b)\r\n{ // 最小公倍数\r\n\t// 先除后乘，避免直接 a*b 时更容易溢出。\r\n\treturn a / gcd(a, b) * b;\r\n}\r\n// 快速幂：计算 x^n mod Mod。\r\nll qp(ll x, ll n)\r\n{ // 快速幂\r\n\tll ans = 1;\r\n\t// 先把底数压到模意义下，后面每次乘法都保持在 mod 范围内。\r\n\tx %= Mod;\r\n\twhile (n > 0)\r\n\t{\r\n\t\t// 若当前二进制位为 1，就把这一位贡献乘进答案。\r\n\t\tif (n & 1)\r\n\t\t\tans = (ans * x) % Mod;\r\n\t\t// 底数平方，对应“二进制位向高位推进一位”。\r\n\t\tx = (x * x) % Mod;\r\n\t\t// 指数右移，继续处理下一位二进制位。\r\n\t\tn >>= 1;\r\n\t}\r\n\treturn ans;\r\n}\r\nconst int N = 1e6 + 5;\r\nbool is_prime[N];\r\nint prime[N], cnt = 0;\r\n// 线性筛：prime 数组中保存所有质数。\r\nvoid sieve(int n)\r\n{ // 线性筛\r\n\t// 先默认 [2,n] 都可能是质数，后面在筛的过程中再删掉合数。\r\n\tfill(is_prime + 2, is_prime + n + 1, true);\r\n\tfor (int i = 2; i <= n; ++i)\r\n\t{\r\n\t\t// 若 i 还没被筛掉，说明它是质数，收进 prime 数组。\r\n\t\tif (is_prime[i])\r\n\t\t\tprime[cnt++] = i;\r\n\t\tfor (int j = 0; j < cnt && i * prime[j] <= n; ++j)\r\n\t\t{\r\n\t\t\t// 每个合数 i*prime[j] 在这里第一次被它的最小质因子筛掉。\r\n\t\t\tis_prime[i * prime[j]] = false;\r\n\t\t\t// 一旦 prime[j] 是 i 的最小质因子，就必须停下。\r\n\t\t\t// 这样才能保证每个合数只被筛一次，这就是线性筛名字的来源。\r\n\t\t\tif (i % prime[j] == 0)\r\n\t\t\t\tbreak;\r\n\t\t}\r\n\t}\r\n}\r\nint main()\r\n{\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-数学与精度-整数三分-cpp",
      "title": "整数三分",
      "fileName": "整数三分.cpp",
      "relativePath": "模板库/基础/数学与精度/整数三分.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "数学与精度"
      ],
      "layers": [
        "基础能力",
        "数学与精度"
      ],
      "note": "适合处理精度、数论、数值计算等基础问题。",
      "difficulty": "基础",
      "scenarios": [
        "数值计算",
        "精度或数学优化"
      ],
      "signals": [
        "数值范围大",
        "普通整型或暴力不够用"
      ],
      "risks": [
        "精度与溢出要优先检查",
        "公式推导错比实现错更隐蔽"
      ],
      "keywords": [
        "基础能力",
        "数学与精度",
        "整数三分"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst int N=1e5+5;\r\nll A,B,C,t[N],b[N];\r\nint n,m;\r\nll f(ll p){\r\n\tll ans=0,x=0,y=0;\r\n\tfor(int i=1;i<=m;++i){\r\n\t\tif(b[i]<p) x+=p-b[i];\r\n\t\telse y+=b[i]-p;\r\n\t}\r\n\tif(A<B){\r\n\t\tif(x<y){\r\n\t\t\tans+=x*A;\r\n\t\t\ty-=x;\r\n\t\t}\r\n\t\telse{\r\n\t\t\tans+=y*A;\r\n\t\t\ty=0;\r\n\t\t}\r\n\t}\r\n\tans+=y*B;\r\n\tfor(int i=1;i<=n;++i)\r\n\t\tif(t[i]<p) ans+=(p-t[i])*C;\r\n\treturn ans;\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tcin>>A>>B>>C>>n>>m;\r\n\tfor(int i=1;i<=n;++i) cin>>t[i];\r\n\tfor(int i=1;i<=m;++i) cin>>b[i];\r\n\tsort(t+1,t+n+1); sort(b+1,b+m+1);\r\n\tif(C==1e16){\r\n\t\tcout<<f(t[1]);\r\n\t\treturn 0;\r\n\t} \r\n\tif(A==1e9&&B==1e9){\r\n\t\tcout<<f(b[m]);\r\n\t\treturn 0;\r\n\t}\r\n\tll l=t[1],r=b[m];\r\n\twhile(r-l>2){\r\n\t\tint k=(r-l)/3;\r\n\t\tint m1=l+k,m2=r-k;\r\n\t\tif(f(m1)>f(m2)) l=m1;\r\n\t\telse r=m2;\r\n\t}\r\n\tll ans=1e18;\r\n\tfor(int i=l;i<=r;++i)\r\n\t\tans=min(ans,f(i));\r\n\tcout<<ans;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-数学与精度-int128快速幂与防溢出乘法-cpp",
      "title": "int128快速幂与防溢出乘法",
      "fileName": "int128快速幂与防溢出乘法.cpp",
      "relativePath": "模板库/基础/数学与精度/int128快速幂与防溢出乘法.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "数学与精度"
      ],
      "layers": [
        "基础能力",
        "数学与精度"
      ],
      "note": "适合处理精度、数论、数值计算等基础问题。",
      "difficulty": "基础",
      "scenarios": [
        "数值计算",
        "精度或数学优化"
      ],
      "signals": [
        "数值范围大",
        "普通整型或暴力不够用"
      ],
      "risks": [
        "精度与溢出要优先检查",
        "公式推导错比实现错更隐蔽"
      ],
      "keywords": [
        "基础能力",
        "数学与精度",
        "int128快速幂与防溢出乘法"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\nusing ll = long long;\r\nusing i128 = __int128_t;\r\nusing u128 = __uint128_t;\r\n\r\n// 把 __int128 转成字符串，方便把精确乘积直接输出出来。\r\n// 常见场景是 long long * long long 会溢出，但 __int128 能先把真实结果托住。\r\nstring toString128(i128 value)\r\n{\r\n\tif (value == 0)\r\n\t\treturn \"0\";\r\n\tbool is_negative = value < 0;\r\n\tu128 magnitude = is_negative ? static_cast<u128>(-(value + 1)) + 1 : static_cast<u128>(value);\r\n\tstring digits;\r\n\twhile (magnitude > 0)\r\n\t{\r\n\t\tdigits.push_back(char('0' + magnitude % 10));\r\n\t\tmagnitude /= 10;\r\n\t}\r\n\tif (is_negative)\r\n\t\tdigits.push_back('-');\r\n\treverse(digits.begin(), digits.end());\r\n\treturn digits;\r\n}\r\n\r\nvoid print128(i128 value)\r\n{\r\n\tcout << toString128(value);\r\n}\r\n\r\n// 把数规范到 [0, mod - 1]，这样后面的取模乘法和快速幂都能统一处理负数底数。\r\nll normalizeMod(ll value, ll mod)\r\n{\r\n\tvalue %= mod;\r\n\tif (value < 0)\r\n\t\tvalue += mod;\r\n\treturn value;\r\n}\r\n\r\n// 安全计算 (a * b) % mod。\r\n// 核心思想是先把乘法放到 __int128 里做，再对 mod 取余，避免 long long 中间乘积溢出。\r\n// 这个写法适用于 a、b、mod 本身都在 long long 范围内的常见竞赛题。\r\nll multiplyMod(ll a, ll b, ll mod)\r\n{\r\n\ta = normalizeMod(a, mod);\r\n\tb = normalizeMod(b, mod);\r\n\treturn static_cast<ll>((static_cast<i128>(a) * b) % mod);\r\n}\r\n\r\n// 二进制快速幂。\r\n// 每次遇到指数当前位是 1，就把答案乘上当前底数；\r\n// 每轮都把底数平方，并把指数右移一位。\r\n// 这里所有乘法都通过 multiplyMod 完成，保证不会在 long long 乘法时炸掉。\r\nll fastPowerMod(ll base, ll exponent, ll mod)\r\n{\r\n\tbase = normalizeMod(base, mod);\r\n\tll result = 1 % mod;\r\n\twhile (exponent > 0)\r\n\t{\r\n\t\tif (exponent & 1)\r\n\t\t\tresult = multiplyMod(result, base, mod);\r\n\t\tbase = multiplyMod(base, base, mod);\r\n\t\texponent >>= 1;\r\n\t}\r\n\treturn result;\r\n}\r\n\r\n/*\r\n输入格式：\r\n一行输入四个整数 a、b、exponent、mod。\r\n\r\n含义说明：\r\na、b 用来演示“先乘再取模”时如何避免 long long 中间乘积溢出。\r\nexponent、mod 用来演示 a^exponent mod mod 的快速幂写法。\r\n\r\n使用前提：\r\n1. a、b、exponent、mod 都在 long long 范围内。\r\n2. exponent >= 0。\r\n3. mod > 0。\r\n\r\n输入样例：\r\n123456789123456789 987654321987654321 1234567 1000000007\r\n\r\n输出样例：\r\na * b = 121932631356500531347203169112635269\r\n(a * b) % mod = 327846861\r\na^exponent % mod = 346632033\r\n\r\n补充说明：\r\n如果 a、b、mod 本身已经是 __int128 级别，这种“直接用 __int128 托乘法”的写法就不一定够了，\r\n因为 __int128 * __int128 仍然可能溢出。那种场景通常要改用龟速乘、Barrett Reduction 或 Montgomery。\r\n*/\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\tll a, b, exponent, mod;\r\n\tcin >> a >> b >> exponent >> mod;\r\n\r\n\tif (mod <= 0)\r\n\t{\r\n\t\tcout << \"mod must be positive\\n\";\r\n\t\treturn 0;\r\n\t}\r\n\tif (exponent < 0)\r\n\t{\r\n\t\tcout << \"exponent must be non-negative\\n\";\r\n\t\treturn 0;\r\n\t}\r\n\r\n\t// 这是“精确乘积”展示，说明 __int128 能兜住两个 long long 的乘法结果。\r\n\ti128 exact_product = static_cast<i128>(a) * b;\r\n\tcout << \"a * b = \";\r\n\tprint128(exact_product);\r\n\tcout << '\\n';\r\n\r\n\t// 这是竞赛里更常见的写法：虽然最终只要模意义下的值，\r\n\t// 但中间乘法先放进 __int128，避免 long long 溢出后再取模变错。\r\n\tcout << \"(a * b) % mod = \" << multiplyMod(a, b, mod) << '\\n';\r\n\r\n\t// 快速幂中的每一步乘法也都要经过 multiplyMod，\r\n\t// 否则 base * base 或 result * base 仍然可能在 long long 上溢出。\r\n\tcout << \"a^exponent % mod = \" << fastPowerMod(a, exponent, mod) << '\\n';\r\n\r\n\t// 常用编译命令：g++ -std=c++17 int128快速幂与防溢出乘法.cpp\r\n\treturn 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-数学与精度-int128示例-cpp",
      "title": "int128示例",
      "fileName": "int128示例.cpp",
      "relativePath": "模板库/基础/数学与精度/int128示例.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "数学与精度"
      ],
      "layers": [
        "基础能力",
        "数学与精度"
      ],
      "note": "适合处理精度、数论、数值计算等基础问题。",
      "difficulty": "基础",
      "scenarios": [
        "数值计算",
        "精度或数学优化"
      ],
      "signals": [
        "数值范围大",
        "普通整型或暴力不够用"
      ],
      "risks": [
        "精度与溢出要优先检查",
        "公式推导错比实现错更隐蔽"
      ],
      "keywords": [
        "基础能力",
        "数学与精度",
        "int128示例"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\nusing i128 = __int128_t;\r\nusing u128 = __uint128_t;\r\n\r\n// 把十进制字符串读成 __int128。\r\n// 因为 cin 不支持直接读 __int128，所以要手动做“当前值 * 10 + 新数字”。\r\n// 负数不直接取反到正数处理，而是先记录符号，最后再统一加回负号。\r\ni128 read128()\r\n{\r\n\tstring text;\r\n\tcin >> text;\r\n\tint position = 0;\r\n\tbool is_negative = false;\r\n\tif (text[position] == '-' || text[position] == '+')\r\n\t{\r\n\t\tis_negative = text[position] == '-';\r\n\t\t++position;\r\n\t}\r\n\tu128 magnitude = 0;\r\n\tfor (; position < static_cast<int>(text.size()); ++position)\r\n\t\tmagnitude = magnitude * 10 + (text[position] - '0');\r\n\tif (!is_negative)\r\n\t\treturn static_cast<i128>(magnitude);\r\n\t// 写成 - (magnitude - 1) - 1，能避开最小负数直接取反时的溢出问题。\r\n\treturn -static_cast<i128>(magnitude - 1) - 1;\r\n}\r\n\r\n// 把 __int128 转成字符串。\r\n// 若 value < 0，先取“绝对值的无符号幅值”，再从低位到高位依次拆数字。\r\n// 最后翻转字符串，就得到正常的人类阅读顺序。\r\nstring toString128(i128 value)\r\n{\r\n\tif (value == 0)\r\n\t\treturn \"0\";\r\n\tbool is_negative = value < 0;\r\n\tu128 magnitude = is_negative ? static_cast<u128>(-(value + 1)) + 1 : static_cast<u128>(value);\r\n\tstring digits;\r\n\twhile (magnitude > 0)\r\n\t{\r\n\t\tdigits.push_back(char('0' + magnitude % 10));\r\n\t\tmagnitude /= 10;\r\n\t}\r\n\tif (is_negative)\r\n\t\tdigits.push_back('-');\r\n\treverse(digits.begin(), digits.end());\r\n\treturn digits;\r\n}\r\n\r\n// 直接输出 __int128，比赛时可以像输出普通整数一样复用。\r\nvoid print128(i128 value)\r\n{\r\n\tcout << toString128(value);\r\n}\r\n\r\n/*\r\n输入格式：\r\n一行输入两个整数 a、b。\r\n\r\n输入样例：\r\n123456789012345678901234567 1000000000000\r\n\r\n输出样例：\r\na = 123456789012345678901234567\r\nb = 1000000000000\r\na + b = 123456789012346678901234567\r\na - b = 123456789012344678901234567\r\na * b = 123456789012345678901234567000000000000\r\na / b = 123456789012345\r\na % b = 678901234567\r\ncompare: a > b\r\n*/\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\t// 输入两个整数 a、b。\r\n\t// 这两个数可以超过 long long，但必须仍在 __int128 的表示范围内。\r\n\ti128 a = read128();\r\n\ti128 b = read128();\r\n\r\n\t// 先原样输出一遍，验证“读入 + 输出”这一套函数是正常工作的。\r\n\tcout << \"a = \";\r\n\tprint128(a);\r\n\tcout << '\\n';\r\n\tcout << \"b = \";\r\n\tprint128(b);\r\n\tcout << '\\n';\r\n\r\n\t// 下面演示 __int128 最常见的几类运算。\r\n\t// 其中乘法结果也必须落在 __int128 范围内，否则依然会溢出。\r\n\tcout << \"a + b = \";\r\n\tprint128(a + b);\r\n\tcout << '\\n';\r\n\r\n\tcout << \"a - b = \";\r\n\tprint128(a - b);\r\n\tcout << '\\n';\r\n\r\n\tcout << \"a * b = \";\r\n\tprint128(a * b);\r\n\tcout << '\\n';\r\n\r\n\t// 除法和取模要先判断除数是否为 0。\r\n\t// 这是语义层面的必要判定，和是不是 __int128 无关。\r\n\tif (b != 0)\r\n\t{\r\n\t\tcout << \"a / b = \";\r\n\t\tprint128(a / b);\r\n\t\tcout << '\\n';\r\n\r\n\t\tcout << \"a % b = \";\r\n\t\tprint128(a % b);\r\n\t\tcout << '\\n';\r\n\t}\r\n\telse\r\n\t{\r\n\t\tcout << \"a / b = undefined (division by zero)\\n\";\r\n\t\tcout << \"a % b = undefined (mod by zero)\\n\";\r\n\t}\r\n\r\n\t// 比较运算和普通整数完全一致，可以直接写 <、>、==。\r\n\tcout << \"compare: \";\r\n\tif (a < b)\r\n\t\tcout << \"a < b\\n\";\r\n\telse if (a > b)\r\n\t\tcout << \"a > b\\n\";\r\n\telse\r\n\t\tcout << \"a == b\\n\";\r\n\r\n\t// 编译提醒：__int128 是 GCC / Clang 扩展，MSVC 不支持。\r\n\t// 常用编译命令：g++ -std=c++17 int128示例.cpp\r\n\treturn 0;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-数学与精度-ntt-cpp",
      "title": "ntt",
      "fileName": "ntt.cpp",
      "relativePath": "模板库/基础/数学与精度/ntt.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "数学与精度"
      ],
      "layers": [
        "基础能力",
        "数学与精度"
      ],
      "note": "适合处理精度、数论、数值计算等基础问题。",
      "difficulty": "进阶",
      "scenarios": [
        "数值计算",
        "精度或数学优化"
      ],
      "signals": [
        "数值范围大",
        "普通整型或暴力不够用"
      ],
      "risks": [
        "精度与溢出要优先检查",
        "公式推导错比实现错更隐蔽"
      ],
      "keywords": [
        "基础能力",
        "数学与精度",
        "ntt"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst ll Mod = 998244353;\r\nconst ll G = 3, invG = 332748118;\r\n// 快速幂。\r\nll qp(ll x, ll n)\r\n{\r\n\tll ans = 1;\r\n\twhile (n > 0)\r\n\t{\r\n\t\t// 指数当前位为 1，就把这一位对应的贡献乘进答案。\r\n\t\tif (n & 1)\r\n\t\t\tans = ans * x % Mod;\r\n\t\t// 底数平方，对应二进制位向更高位推进。\r\n\t\tx = x * x % Mod;\r\n\t\t// 继续处理下一位二进制位。\r\n\t\tn >>= 1;\r\n\t}\r\n\treturn ans;\r\n}\r\n// NTT 本体：flag=false 为正变换，flag=true 为逆变换。\r\nvoid ntt(vector<ll> &a, bool flag)\r\n{\r\n\tint len = a.size();\r\n\t// 正变换用原根 G，逆变换用它在模意义下的逆元 invG。\r\n\tll g = flag ? invG : G;\r\n\t// 位逆序重排。\r\n\tfor (int i = 1, j = 0; i < len; ++i)\r\n\t{\r\n\t\tint bit = len >> 1;\r\n\t\t// 这段是在模拟“二进制加一”时从低位往高位的进位过程，\r\n\t\t// 最终得到 i 的 bit-reversal 对应位置 j。\r\n\t\twhile (j & bit)\r\n\t\t{\r\n\t\t\tj ^= bit;\r\n\t\t\tbit >>= 1;\r\n\t\t}\r\n\t\tj ^= bit;\r\n\t\t// 若目标位置在后面，就交换到位逆序后的下标上。\r\n\t\tif (i < j)\r\n\t\t\tswap(a[i], a[j]);\r\n\t}\r\n\t// 蝴蝶操作，区间长度每次翻倍。\r\n\tfor (int s = 2; s <= len; s <<= 1)\r\n\t{\r\n\t\t// wl 是当前层单位根，每次把 w 乘上 wl 就是在当前长度 s 的圆周上前进一步。\r\n\t\tll wl = qp(g, (Mod - 1) / s);\r\n\t\tfor (int i = 0; i < len; i += s)\r\n\t\t{\r\n\t\t\tll w = 1;\r\n\t\t\tfor (int j = 0; j < s / 2; ++j)\r\n\t\t\t{\r\n\t\t\t\t// u 是前半段当前点，v 是后半段当前点乘上旋转因子 w 后的值。\r\n\t\t\t\tll u = a[i + j], v = (a[i + j + s / 2] * w) % Mod;\r\n\t\t\t\t// 两式就是 NTT 的标准蝶形合并：\r\n\t\t\t\t// 前半段得到 u+v，后半段得到 u-v。\r\n\t\t\t\ta[i + j] = (u + v) % Mod;\r\n\t\t\t\ta[i + j + s / 2] = (u - v + Mod) % Mod;\r\n\t\t\t\t// 更新到下一个位置对应的旋转因子。\r\n\t\t\t\tw = w * wl % Mod;\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\tif (flag)\r\n\t{\r\n\t\t// 逆变换做完后，每个位置都要再乘上 len 的逆元，恢复真正的系数值。\r\n\t\tll invn = qp(len, Mod - 2);\r\n\t\tfor (int i = 0; i < len; ++i)\r\n\t\t\ta[i] = a[i] * invn % Mod;\r\n\t}\r\n}\r\nint main()\r\n{\r\n\tint n1, n2, len = 1;\r\n\tcin >> n1 >> n2;\r\n\t// len 需要扩到不小于 n1+n2-1 的最小 2 的幂。\r\n\twhile (len < n1 + n2 - 1)\r\n\t\tlen <<= 1;\r\n\t// a、b 先装系数，c 用来装点值相乘后的结果。\r\n\tvector<ll> a(len, 0), b(len, 0), c(len, 0);\r\n\tfor (int i = 0; i < n1; ++i)\r\n\t\tcin >> a[i];\r\n\tfor (int i = 0; i < n2; ++i)\r\n\t\tcin >> b[i];\r\n\tntt(a, false);\r\n\tntt(b, false);\r\n\t// 点值相乘等价于系数卷积。\r\n\tfor (int i = 0; i < len; ++i)\r\n\t\tc[i] = a[i] * b[i] % Mod;\r\n\tntt(c, true);\r\n\tfor (int i = 0; i < n1 + n2 - 1; ++i)\r\n\t\tcout << c[i] << \" \";\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-字符串-bwt变换-cpp",
      "title": "BWT变换",
      "fileName": "BWT变换.cpp",
      "relativePath": "模板库/基础/字符串/BWT变换.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "字符串"
      ],
      "layers": [
        "基础能力",
        "字符串"
      ],
      "note": "归档字符串处理与编码变换相关模板。",
      "difficulty": "基础",
      "scenarios": [
        "字符串处理",
        "字符序列变换"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "基础能力",
        "字符串",
        "BWT变换"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tint length, zero_count = 0, first_column_cursor = 0;\r\n\tcin >> length;\r\n\t// 这里在按 BWT 的 LF-mapping 思想重建原串。\r\n\t// last_column[i] 只含 0/1，last_to_first 记录“最后一列 -> 第一列”的对应关系。\r\n\tvector<int> last_column(length), last_to_first(length), rebuild_order(length);\r\n\tfor (int i = 0; i < length; ++i)\r\n\t{\r\n\t\tcin >> last_column[i];\r\n\t\t// 先统计有多少个 0；\r\n\t\t// 因为把最后一列稳定排序后，所有 0 会排在前面，1 会排在后面。\r\n\t\tzero_count += (last_column[i] == 0);\r\n\t}\r\n\t// 先把最后一列中的所有 0 对应位置按出现顺序放进 invf，\r\n\t// 等价于构造“排序后第一列”的前半段。\r\n\tfor (int i = 0; i < length; ++i)\r\n\t\tif (last_column[i] == 0)\r\n\t\t\tlast_to_first[first_column_cursor++] = i;\r\n\t// 再把所有 1 放进去，构成第一列的后半段。\r\n\tfor (int i = 0; i < length; ++i)\r\n\t\tif (last_column[i] == 1)\r\n\t\t\tlast_to_first[first_column_cursor++] = i;\r\n\tint current_last_column_pos = 0;\r\n\t// 从 BWT 的首行开始，反复做 LF-mapping：\r\n\t// “当前最后一列的位置 -> 对应第一列的位置”。\r\n\t// rebuild_order[i] 记录恢复原串时，第 i 步应该取最后一列中的哪一个字符。\r\n\tfor (int i = length - 1; i >= 0; --i)\r\n\t{\r\n\t\t// 当前 current_last_column_pos 表示“这一轮回溯时所在的最后一列位置”。\r\n\t\t// 把它记进 rebuild_order[i] 后，再跳到与之对应的第一列位置，准备下一轮回溯。\r\n\t\trebuild_order[i] = current_last_column_pos;\r\n\t\tcurrent_last_column_pos = last_to_first[current_last_column_pos];\r\n\t}\r\n\t// 按 rebuild_order 逆序恢复字符。\r\n\t// rebuild_order[0] 对应的是恢复出的第一个字符，它落在第一列前 zero_count 个位置时就是 0，否则是 1。\r\n\tstring decoded = rebuild_order[0] + 1 <= zero_count ? \"0\" : \"1\";\r\n\tint decoded_zero_count = (decoded[0] == '0');\r\n\tfor (int i = 0; i < length - 1; ++i)\r\n\t{\r\n\t\t// last_column[rebuild_order[i]] 就是当前应接到答案前面的那个字符。\r\n\t\tstring current_token(1, last_column[rebuild_order[i]] + '0');\r\n\t\t// 这个模板的输出格式本身就在字符间加空格，所以这里补一个空格再拼接。\r\n\t\tcurrent_token += \" \";\r\n\t\tdecoded_zero_count += (current_token[0] == '0');\r\n\t\t// 因为 rebuild_order 是从后往前回溯出来的，所以这里要不断往字符串前面拼。\r\n\t\tdecoded = current_token + decoded;\r\n\t}\r\n\t// 最后再校验一次 0 的数量，数量对不上说明输入本身不合法或无法还原。\r\n\tif (decoded_zero_count == zero_count)\r\n\t\tcout << decoded;\r\n\telse\r\n\t\tcout << \"-1\";\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础-字符串-string类整理-cpp",
      "title": "string类整理",
      "fileName": "string类整理.cpp",
      "relativePath": "模板库/基础/字符串/string类整理.cpp",
      "originalFolders": [
        "模板库",
        "基础",
        "字符串"
      ],
      "layers": [
        "基础能力",
        "字符串"
      ],
      "note": "归档字符串处理与编码变换相关模板。",
      "difficulty": "基础",
      "scenarios": [
        "字符串处理",
        "字符序列变换"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "基础能力",
        "字符串",
        "string类整理"
      ],
      "code": "#include <iostream>\r\n#include <string>\r\n#include <algorithm> // 包含 reverse, sort, count\r\n#include <cctype>    // 包含 toupper, tolower\r\nusing namespace std;\r\n\r\n// 这个文件是 string 常用操作速查表，适合复习时快速翻阅。\r\n// ==========================================\r\n// 模块 1：字符串基础与修改操作\r\n// ==========================================\r\nvoid test_basic_and_modify()\r\n{\r\n    cout << \"--- 1. 基础与修改 ---\" << endl;\r\n    string s = \"Hello\";\r\n\r\n    // 基础信息\r\n    cout << \"原串: \" << s << \"，长度: \" << s.size() << endl;\r\n\r\n    // 拼接操作 (最常用 +=)\r\n    s += \" C++\";      // \"Hello C++\"\r\n    s.push_back('!'); // \"Hello C++!\"\r\n    cout << \"拼接后: \" << s << endl;\r\n\r\n    // 尾部删除\r\n    s.pop_back(); // \"Hello C++\"\r\n    cout << \"删去尾字符: \" << s << endl;\r\n\r\n    // 插入与区间删除 (注意：参数是起始下标和长度)\r\n    s.insert(6, \"Awesome \"); // 在下标6处插入：\"Hello Awesome C++\"\r\n    cout << \"插入后: \" << s << endl;\r\n\r\n    s.erase(6, 8);                   // 从下标6开始，删除8个字符\r\n    cout << \"删除后: \" << s << endl; // 变回 \"Hello C++\"\r\n}\r\n\r\n// ==========================================\r\n// 模块 2：截取与查找 (?? 考试最高频)\r\n// ==========================================\r\n// substr 和 find 是竞赛里最常用的两个字符串接口。\r\nvoid test_substr_and_find()\r\n{\r\n    cout << \"\\n--- 2. 截取与查找 ---\" << endl;\r\n    string s = \"abcdebc\";\r\n\r\n    // 截取: substr(起始下标, 长度)\r\n    string sub1 = s.substr(1, 3); // 从下标1开始截3个字符 -> \"bcd\"\r\n    string sub2 = s.substr(3);    // 从下标3开始一直到末尾 -> \"debc\"\r\n    cout << \"截取子串1: \" << sub1 << \" | 截取子串2: \" << sub2 << endl;\r\n\r\n    // 查找: find(目标)\r\n    size_t pos1 = s.find(\"bc\");    // 第一次出现 \"bc\" 的位置 -> 1\r\n    size_t pos2 = s.find(\"bc\", 2); // 从下标2开始往后找 \"bc\" -> 5\r\n    cout << \"第一次找到 'bc' 的下标: \" << pos1 << endl;\r\n    cout << \"跳过前面，再次找到 'bc' 的下标: \" << pos2 << endl;\r\n\r\n    // 判断找不到的情况 (必须用 string::npos)\r\n    if (s.find(\"xyz\") == string::npos)\r\n    {\r\n        cout << \"查找 'xyz' 的结果: 未找到 (string::npos)!\" << endl;\r\n    }\r\n}\r\n\r\n// ==========================================\r\n// 模块 3：类型互相转换 (高精度/模拟题神技)\r\n// ==========================================\r\n// to_string / stoi / stoll / stod 是字符串与数值互转的常用接口。\r\nvoid test_conversions()\r\n{\r\n    cout << \"\\n--- 3. 字符串与数字转换 (含 stod) ---\" << endl;\r\n\r\n    // 1. 数字转字符串 (整数和浮点数都可以用 to_string)\r\n    int num = 9876;\r\n    double pi = 3.14159;\r\n    string s_num = to_string(num);\r\n    string s_pi = to_string(pi);\r\n    cout << \"整数转字符串: \" << s_num << endl;\r\n    cout << \"浮点转字符串: \" << s_pi << \" (注意: to_string 默认保留6位小数)\" << endl;\r\n\r\n    // 2. 字符串转数字 (stoi, stoll, stod)\r\n    string s_int = \"1024\";\r\n    string s_ll = \"123456789012345\";\r\n    string s_double = \"2.71828\";\r\n\r\n    int a = stoi(s_int);       // string to int\r\n    long long b = stoll(s_ll); // string to long long\r\n    double c = stod(s_double); // string to double (?? 新增)\r\n\r\n    cout << \"字符串转整数 (stoi): \" << a + 1 << \" (验证加法)\" << endl;\r\n    cout << \"字符串转超大整数 (stoll): \" << b << endl;\r\n    cout << \"字符串转浮点数 (stod): \" << c * 2 << \" (验证乘法)\" << endl;\r\n}\r\n\r\n// ==========================================\r\n// 模块 4：搭配算法与大小写转换\r\n// ==========================================\r\n// reverse / sort / count 等算法都能直接作用在 string 上。\r\nvoid test_algorithm()\r\n{\r\n    cout << \"\\n--- 4. 算法与大小写 ---\" << endl;\r\n    string s = \"abABaba\";\r\n\r\n    // 统计某个字符的出现次数\r\n    int cnt = count(s.begin(), s.end(), 'a');\r\n    cout << \"'a' 出现的次数: \" << cnt << endl;\r\n\r\n    // 反转字符串 (回文题必备)\r\n    reverse(s.begin(), s.end());\r\n    cout << \"反转后: \" << s << endl;\r\n\r\n    // 字符串排序 (按字典序)\r\n    sort(s.begin(), s.end());\r\n    cout << \"排序后: \" << s << endl;\r\n\r\n    // 遍历修改：全部转大写字母\r\n    string test_case = \"Code_123!\";\r\n    for (int i = 0; i < test_case.size(); i++)\r\n    {\r\n        if (test_case[i] >= 'a' && test_case[i] <= 'z')\r\n        {\r\n            test_case[i] -= 32;\r\n        }\r\n    }\r\n    cout << \"全部转大写后: \" << test_case << endl;\r\n}\r\n\r\n// ==========================================\r\n// 模块 5：输入流避坑指南 (仅作演示)\r\n// ==========================================\r\nvoid test_io_trap()\r\n{\r\n    /*\r\n    cout << \"\\n--- 5. 致命输入流陷阱演示 ---\" << endl;\r\n    int n;\r\n    cin >> n;\r\n    cin.ignore(); // 核心：吃掉回车！\r\n    string s;\r\n    getline(cin, s);\r\n    */\r\n}\r\n\r\nint main()\r\n{\r\n    test_basic_and_modify();\r\n    test_substr_and_find();\r\n    test_conversions();\r\n    test_algorithm();\r\n    test_io_trap();\r\n\r\n    return 0;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "基础算法-搜索-bfs搜索-cpp-cpp",
      "title": "bfs搜索-cpp",
      "fileName": "bfs搜索-cpp.cpp",
      "relativePath": "模板库/基础算法/搜索/bfs搜索-cpp.cpp",
      "originalFolders": [
        "模板库",
        "基础算法",
        "搜索"
      ],
      "layers": [
        "基础算法",
        "搜索"
      ],
      "note": "标准四联通网格 BFS 模板，用于求解起点到终点的最短步数，支持边界与访问状态控制",
      "difficulty": "中级",
      "scenarios": [
        "网格最短路径",
        "迷宫寻路",
        "状态空间广度枚举"
      ],
      "signals": [
        "逐层扩展",
        "边权为1",
        "需记录步数或路径长度",
        "目标状态明确"
      ],
      "risks": [
        "未初始化 vis 数组导致错误",
        "方向数组遗漏或顺序错乱",
        "边界检查不完整（如未考虑0索引）",
        "队列中未保存距离信息导致无法求最短路"
      ],
      "keywords": [
        "bfs",
        "网格搜索",
        "最短步数",
        "队列",
        "四联通",
        "状态去重",
        "vis标记",
        "层级遍历"
      ],
      "code": "#include <bits/stdc++.h>\nusing namespace std;\nconst int N = 1e3 + 5;\n// 四联通方向数组：右、下、左、上。\nint dx[4] = {0, 1, 0, -1};\nint dy[4] = {1, 0, -1, 0};\nint n, m, edx, edy;\nbool vis[N][N];\nstruct Node\n{\n\tint x, y, dist;\n};\n// BFS 适用于边权全为 1 的最短路。\n// 队列中保存当前位置以及从起点到这里的步数。\nint bfs(int stx, int sty)\n{\n\tqueue<Node> q;\n\tq.push({stx, sty, 0});\n\tvis[stx][sty] = true;\n\twhile (!q.empty())\n\t{\n\t\tNode cur = q.front();\n\t\tq.pop();\n\t\tif (cur.x == edx && cur.y == edy)\n\t\t\treturn cur.dist;\n\t\tfor (int i = 0; i < 4; ++i)\n\t\t{\n\t\t\tint tx = cur.x + dx[i];\n\t\t\tint ty = cur.y + dy[i];\n\t\t\t// 只有在边界内且没访问过时才入队，否则会重复扩展同一个点。\n\t\t\tif (tx > 0 && tx <= n && ty > 0 && ty <= m && !vis[tx][ty])\n\t\t\t{\n\t\t\t\tvis[tx][ty] = true;\n\t\t\t\tq.push({tx, ty, cur.dist + 1});\n\t\t\t}\n\t\t}\n\t}\n\treturn -1;\n}\nint main()\n{\n}\n",
      "metadataSource": "ai-maintained",
      "metadataUpdatedAt": "2026-06-02T00:30:33.280Z"
    },
    {
      "id": "计算几何-最小覆盖圆-cpp",
      "title": "最小覆盖圆",
      "fileName": "最小覆盖圆.cpp",
      "relativePath": "模板库/计算几何/最小覆盖圆.cpp",
      "originalFolders": [
        "模板库",
        "计算几何"
      ],
      "layers": [
        "计算几何",
        "最小覆盖圆"
      ],
      "note": "随机化增量法求解点集的最小覆盖圆，适用于二维平面上给定 n 个点求最小外接圆的通用模板，支持动态扩展与高精度浮点判断。",
      "difficulty": "基础",
      "scenarios": [
        "点集最小外接圆",
        "几何优化问题",
        "随机化算法应用"
      ],
      "signals": [
        "输入为若干二维点坐标",
        "要求最小半径的圆完全包含所有点",
        "题目未明确给出圆心或半径，需自行构造"
      ],
      "risks": [
        "浮点误差导致边界条件误判（需 eps 处理）",
        "未验证输入规模是否适合 O(n) 随机化算法（n > 1e5 可能超时）",
        "忽略退化情况（如三点共线、两点重合）"
      ],
      "keywords": [
        "最小覆盖圆",
        "随机化增量法",
        "最小外接圆",
        "计算几何",
        "随机 shuffle",
        "in_circle",
        "get_circle2",
        "get_circle3",
        "eps"
      ],
      "code": "#include <bits/stdc++.h>\nusing namespace std;\nusing ll=long long;\nconst double eps=1e-12;\nstruct Point{\n\tdouble x,y;\n};\nstruct Circle{\n\tPoint c;\n\tdouble r;\n};\ndouble dist(Point a,Point b){\n\treturn hypot(a.x-b.x,a.y-b.y);\n}\nbool in_circle(Point p,Circle c){\n\treturn dist(p,c.c)<=c.r+eps;\n}\nCircle get_circle2(Point a,Point b){\n\tPoint c={(a.x+b.x)/2.0,(a.y+b.y)/2.0};\n\treturn {c,dist(a,b)/2.0};\n}\nCircle get_circle3(Point p1,Point p2,Point p3){\n\tdouble ax=p2.x-p1.x,ay=p2.y-p1.y;\n\tdouble bx=p3.x-p1.x,by=p3.y-p1.y;\n\tdouble d=2.0*(ax*by-ay*bx);\n\tdouble cx=(by*(ax*ax+ay*ay)-ay*(bx*bx+by*by))/d;\n\tdouble cy=(ax*(bx*bx+by*by)-bx*(ax*ax+ay*ay))/d;\n\tPoint c={p1.x+cx,p1.y+cy};\n\treturn {c,dist(c,p1)};\n}\nint main(){\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\tint n; cin>>n;\n\tvector<Point> a(n);\n\tfor(int i=0;i<n;++i) cin>>a[i].x>>a[i].y;\n\tmt19937 rng(114514);\n\tshuffle(a.begin(),a.end(),rng);\n\tCircle ans={a[0],0.0};\n\tfor(int i=1;i<n;++i)\n\t\tif(!in_circle(a[i],ans)){\n\t\t\tans={a[i],0.0};\n\t\t\tfor(int j=0;j<i;++j)\n\t\t\t\tif(!in_circle(a[j],ans)){\n\t\t\t\t\tans=get_circle2(a[i],a[j]);\n\t\t\t\t\tfor(int k=0;k<j;++k)\n\t\t\t\t\t\tif(!in_circle(a[k],ans))\n\t\t\t\t\t\t\tans=get_circle3(a[i],a[j],a[k]);\n\t\t\t\t}\n\t\t}\n\tcout<<fixed<<setprecision(10);\n\tcout<<ans.r<<\"\\n\";\n\tcout<<ans.c.x<<\" \"<<ans.c.y<<\"\\n\";\n}\n",
      "metadataSource": "ai-maintained",
      "metadataUpdatedAt": "2026-06-02T05:47:20.887Z"
    },
    {
      "id": "模板-cpp",
      "title": "模板",
      "fileName": "模板.cpp",
      "relativePath": "模板库/模板.cpp",
      "originalFolders": [
        "模板库"
      ],
      "layers": [
        "总览",
        "通用入口"
      ],
      "note": "适合作为快速开始的通用代码骨架。",
      "difficulty": "基础",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "总览",
        "通用入口",
        "模板"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nusing ll=long long;\r\nint main(){\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\t\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "三维差分-压维-二分答案-cpp",
      "title": "三维差分+压维+二分答案",
      "fileName": "三维差分+压维+二分答案.cpp",
      "relativePath": "模板库/三维差分+压维+二分答案.cpp",
      "originalFolders": [
        "模板库"
      ],
      "layers": [
        "其他专题",
        "差分与技巧"
      ],
      "note": "适合记录差分、压维等组合技巧。",
      "difficulty": "中级",
      "scenarios": [
        "答案具有单调性",
        "边界定位问题"
      ],
      "signals": [
        "答案范围可枚举",
        "满足性随答案单调变化"
      ],
      "risks": [
        "边界更新不当会死循环",
        "要分清找左边界还是右边界"
      ],
      "keywords": [
        "其他专题",
        "差分与技巧",
        "三维差分+压维+二分答案",
        "单调性",
        "边界",
        "前缀还原",
        "批量更新"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst int N=1000005;\r\nll s[N],d[N];\r\nint a,b,c,m,ans;\r\nstruct attack{\r\n\tint x1,y1,z1,x2,y2,z2;\r\n\tll num;\r\n}t[N];\r\nint id(int x,int y,int z){\r\n\tif(x>a||y>b||z>c) return 0;\r\n\treturn (x-1)*b*c+(y-1)*c+(z-1)+1;\r\n}\r\nbool check(int p){\r\n\tmemset(d,0,sizeof(d));\r\n\tfor(int i=1;i<=p;++i){\r\n\t\tint x1=t[i].x1,y1=t[i].y1,z1=t[i].z1,x2=t[i].x2,y2=t[i].y2,z2=t[i].z2; \r\n\t\tll num=t[i].num;\r\n\t\td[id(x1,y1,z1)]+=num;\r\n\t\td[id(x2+1,y1,z1)]-=num;\r\n\t\td[id(x1,y2+1,z1)]-=num;\r\n\t\td[id(x1,y1,z2+1)]-=num;\r\n\t\td[id(x1,y2+1,z2+1)]+=num;\r\n\t\td[id(x2+1,y1,z2+1)]+=num;\r\n\t\td[id(x2+1,y2+1,z1)]+=num;\r\n\t\td[id(x2+1,y2+1,z2+1)]-=num;\r\n\t}\r\n\tfor(int i=1;i<=a;++i)\r\n\t\tfor(int j=1;j<=b;++j)\r\n\t\t\tfor(int k=1;k<c;++k)\r\n\t\t\t\td[id(i,j,k+1)]+=d[id(i,j,k)];\r\n\tfor(int i=1;i<=a;++i)\r\n\t\tfor(int j=1;j<b;++j)\r\n\t\t\tfor(int k=1;k<=c;++k)\r\n\t\t\t\td[id(i,j+1,k)]+=d[id(i,j,k)];\r\n\tfor(int i=1;i<a;++i)\r\n\t\tfor(int j=1;j<=b;++j)\r\n\t\t\tfor(int k=1;k<=c;++k)\r\n\t\t\t\td[id(i+1,j,k)]+=d[id(i,j,k)];\r\n\tfor(int i=1;i<=a;++i)\r\n\t\tfor(int j=1;j<=b;++j)\r\n\t\t\tfor(int k=1;k<=c;++k)\r\n\t\t\t\tif(d[id(i,j,k)]>s[id(i,j,k)])\r\n\t\t\t\t\treturn true;\r\n\treturn false;\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tcin>>a>>b>>c>>m;\r\n\tfor(int i=1;i<=a;++i)\r\n\t\tfor(int j=1;j<=b;++j)\r\n\t\t\tfor(int k=1;k<=c;++k)\r\n\t\t\t\tcin>>s[id(i,j,k)];\r\n\tfor(int i=1;i<=m;++i)\r\n\t\tcin>>t[i].x1>>t[i].x2>>t[i].y1>>t[i].y2>>t[i].z1>>t[i].z2>>t[i].num;\r\n\tint l=1,r=m;\r\n\twhile(l<=r){\r\n\t\tint mid=(l+r)>>1;\r\n\t\tif(check(mid)){\r\n\t\t\tr=mid-1;\r\n\t\t\tans=mid;\r\n\t\t}\r\n\t\telse l=mid+1;\r\n\t}\r\n\tcout<<ans<<\"\\n\";\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "树状数组-单点修改-区间查询-cpp",
      "title": "单点修改+区间查询",
      "fileName": "单点修改+区间查询.cpp",
      "relativePath": "模板库/树状数组/单点修改+区间查询.cpp",
      "originalFolders": [
        "模板库",
        "树状数组"
      ],
      "layers": [
        "数据结构",
        "树状数组"
      ],
      "note": "按修改与查询的组合方式分类。",
      "difficulty": "中级",
      "scenarios": [
        "前缀信息维护",
        "单点与区间统计"
      ],
      "signals": [
        "多次修改与查询",
        "需要快速维护区间或前缀信息"
      ],
      "risks": [
        "下标通常从 1 开始",
        "lowbit 循环边界容易死循环"
      ],
      "keywords": [
        "数据结构",
        "树状数组",
        "单点修改+区间查询",
        "前缀和",
        "lowbit"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nconst int N=10005;\r\nint tr[N],n;\r\nint lowbit(int x){\r\n\treturn x&-x;\r\n}\r\nvoid update(int x,int d){\r\n\twhile(x<=n){\r\n\t\ttr[x]+=d;\r\n\t\tx+=lowbit(x);\r\n\t}\r\n}\r\nint sum(int x){\r\n\tint s=0;\r\n\twhile(x>0){\r\n\t\ts+=tr[x];\r\n\t\tx-=lowbit(x);\r\n\t}\r\n\treturn s;\r\n}\r\nint main(){\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tint m,a;\r\n\tcin>>n>>m;\r\n\tfor(int i=1;i<=n;++i){\r\n\t\tcin>>a;\r\n\t\tupdate(i,a);\r\n\t}\r\n\tfor(int i=1;i<=m;++i){\r\n\t\tint op,x,y;\r\n\t\tcin>>op>>x>>y;\r\n\t\tif(op==1)\r\n\t\t\tupdate(x,y);\r\n\t\telse\r\n\t\t\tcout<<sum(y)-sum(x-1)<<\"\\n\";\r\n\t}\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "树状数组-区间修改-单点查询-cpp",
      "title": "区间修改+单点查询",
      "fileName": "区间修改+单点查询.cpp",
      "relativePath": "模板库/树状数组/区间修改+单点查询.cpp",
      "originalFolders": [
        "模板库",
        "树状数组"
      ],
      "layers": [
        "数据结构",
        "树状数组"
      ],
      "note": "按修改与查询的组合方式分类。",
      "difficulty": "中级",
      "scenarios": [
        "前缀信息维护",
        "单点与区间统计"
      ],
      "signals": [
        "多次修改与查询",
        "需要快速维护区间或前缀信息"
      ],
      "risks": [
        "下标通常从 1 开始",
        "lowbit 循环边界容易死循环"
      ],
      "keywords": [
        "数据结构",
        "树状数组",
        "区间修改+单点查询",
        "前缀和",
        "lowbit"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst int N=10005;\r\nint tr[N],n,m,a,lst;\r\nint lowbit(int x){\r\n\treturn x&-x;\r\n}\r\nvoid update(int x,int d){\r\n\twhile(x<=n){\r\n\t\ttr[x]+=d;\r\n\t\tx+=lowbit(x);\r\n\t}\r\n}\r\nint sum(int x){\r\n\tint s=0;\r\n\twhile(x>0){\r\n\t\ts+=tr[x];\r\n\t\tx-=lowbit(x);\r\n\t}\r\n\treturn s;\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tcin>>n>>m;\r\n\tfor(int i=1;i<=n;++i){\r\n\t\tcin>>a;\r\n\t\tupdate(i,a-lst);\r\n\t\tlst=a;\r\n\t}\r\n\tfor(int i=1;i<=m;++i){\r\n\t\tint op,x,y,d;\r\n\t\tcin>>op;\r\n\t\tif(op==1){\r\n\t\t\tcin>>x>>y>>d;\r\n\t\t\tupdate(x,d);\r\n\t\t\tupdate(y+1,-d);\r\n\t\t}\r\n\t\telse{\r\n\t\t\tcin>>x;\r\n\t\t\tcout<<sum(x)<<\"\\n\";\r\n\t\t}\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "树状数组-区间修改-区间查询-cpp",
      "title": "区间修改+区间查询",
      "fileName": "区间修改+区间查询.cpp",
      "relativePath": "模板库/树状数组/区间修改+区间查询.cpp",
      "originalFolders": [
        "模板库",
        "树状数组"
      ],
      "layers": [
        "数据结构",
        "树状数组"
      ],
      "note": "按修改与查询的组合方式分类。",
      "difficulty": "中级",
      "scenarios": [
        "前缀信息维护",
        "单点与区间统计"
      ],
      "signals": [
        "多次修改与查询",
        "需要快速维护区间或前缀信息"
      ],
      "risks": [
        "下标通常从 1 开始",
        "lowbit 循环边界容易死循环"
      ],
      "keywords": [
        "数据结构",
        "树状数组",
        "区间修改+区间查询",
        "前缀和",
        "lowbit"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst int N=100005;\r\nll tr1[N],tr2[N],a,lst;\r\nint n,m;\r\nint lowbit(int x){\r\n\treturn x&-x;\r\n}\r\nvoid update(int x,ll d,ll tr[]){\r\n\twhile(x<=n){\r\n\t\ttr[x]+=d;\r\n\t\tx+=lowbit(x);\r\n\t}\r\n}\r\nll sum(int x,ll tr[]){\r\n\tll s=0;\r\n\twhile(x>0){\r\n\t\ts+=tr[x];\r\n\t\tx-=lowbit(x);\r\n\t}\r\n\treturn s;\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tcin>>n>>m;\r\n\tfor(int i=1;i<=n;++i){\r\n\t\tcin>>a;\r\n\t\tupdate(i,a-lst,tr1);\r\n\t\tupdate(i,i*(a-lst),tr2);\r\n\t\tlst=a;\r\n\t}\r\n\tfor(int i=1;i<=m;++i){\r\n\t\tint op,x,y;\r\n\t\tll d;\r\n\t\tcin>>op;\r\n\t\tif(op==1){\r\n\t\t\tcin>>x>>y>>d;\r\n\t\t\tupdate(x,d,tr1);\r\n\t\t\tupdate(y+1,-d,tr1);\r\n\t\t\tupdate(x,d*x,tr2);\r\n\t\t\tupdate(y+1,-(y+1)*d,tr2);\r\n\t\t}\r\n\t\telse{\r\n\t\t\tcin>>x>>y;\r\n\t\t\tcout<<(y+1)*sum(y,tr1)-x*sum(x-1,tr1)-sum(y,tr2)+sum(x-1,tr2)<<\"\\n\";\r\n\t\t}\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "数据结构-线段树-线段树维护区间字段和-cpp",
      "title": "线段树维护区间字段和",
      "fileName": "线段树维护区间字段和.cpp",
      "relativePath": "模板库/数据结构/线段树/线段树维护区间字段和.cpp",
      "originalFolders": [
        "模板库",
        "数据结构",
        "线段树"
      ],
      "layers": [
        "数据结构",
        "线段树"
      ],
      "note": "支持区间查询最大子段和（含左右前缀/后缀信息）的线段树模板，适用于需要维护复杂区间字段（如最大子段和、区间和、前缀/后缀最大值）的场景",
      "difficulty": "进阶",
      "scenarios": [
        "最大子段和查询",
        "区间修改与查询",
        "多维区间信息合并"
      ],
      "signals": [
        "需维护区间内多个字段（sum/lsum/rsum/ans）",
        "合并操作涉及跨左右子区间的组合信息",
        "查询结果依赖子区间端点信息（如rsum+ls.lsum）"
      ],
      "risks": [
        "merge 函数中字段顺序或逻辑错误导致答案错位",
        "query 中左右子区间合并时未正确处理边界重叠",
        "lsum/rsum 的定义易混淆（是否包含当前区间左/右端点）"
      ],
      "keywords": [
        "线段树",
        "区间字段和",
        "最大子段和",
        "lsum",
        "rsum",
        "ans",
        "区间合并",
        "多字段维护"
      ],
      "code": "#include <bits/stdc++.h>\nusing namespace std;\nusing ll=long long;\nconst int N=5e5+5;\nint n,m;\nstruct data{\n\tll sum,ans,lsum,rsum;\n}tree[N*4];\nvoid merge(int p){\n\ttree[p].sum=tree[p<<1].sum+tree[p<<1|1].sum;\n\ttree[p].lsum=max(tree[p<<1].lsum,tree[p<<1].sum+tree[p<<1|1].lsum);\n\ttree[p].rsum=max(tree[p<<1|1].rsum,tree[p<<1|1].sum+tree[p<<1].rsum);\n\ttree[p].ans=max(max(tree[p<<1].ans,tree[p<<1|1].ans),tree[p<<1].rsum+tree[p<<1|1].lsum);\n}\nvoid build(int p,int l,int r){\n\tif(l==r){\n\t\tint x; cin>>x;\n\t\ttree[p].sum=tree[p].ans=tree[p].lsum=tree[p].rsum=x;\n\t\treturn;\n\t}\n\tint m=(l+r)>>1;\n\tbuild(p<<1,l,m);\n\tbuild(p<<1|1,m+1,r);\n\tmerge(p);\n}\nvoid update(int p,int l,int r,int k,ll val){\n\tif(l==r){\n\t\ttree[p].sum=tree[p].lsum=tree[p].rsum=tree[p].ans=val;\n\t\treturn;\n\t}\n\tint m=(l+r)>>1;\n\tif(k<=m) update(p<<1,l,m,k,val);\n\telse if(m<k) update(p<<1|1,m+1,r,k,val);\n\tmerge(p);\n}\ndata query(int p,int l,int r,int ql,int qr){\n\tif(ql<=l&&r<=qr) return tree[p];\n\tint m=(l+r)>>1;\n\tif(qr<=m) return query(p<<1,l,m,ql,qr);\n\telse if(m<ql) return query(p<<1|1,m+1,r,ql,qr);\n\telse{\n\t\tdata now,ls=query(p<<1,l,m,ql,qr),rs=query(p<<1|1,m+1,r,ql,qr);\n\t\tnow.sum=ls.sum+rs.sum;\n\t\tnow.lsum=max(ls.lsum,ls.sum+rs.lsum);\n\t\tnow.rsum=max(rs.rsum,rs.sum+ls.rsum);\n\t\tnow.ans=max(max(ls.ans,rs.ans),ls.rsum+rs.lsum);\n\t\treturn now;\n\t}\n}\nint main(){\n\tios_base::sync_with_stdio(false);\n\tcin.tie(nullptr);\n\tcin>>n>>m;\n\tbuild(1,1,n);\n\tfor(int i=1;i<=m;++i){\n\t\tint op; cin>>op;\n\t\tif(op==1){\n\t\t\tint l,r; cin>>l>>r;\n\t\t\tif(r<l) swap(l,r);\n\t\t\tdata now=query(1,1,n,l,r);\n\t\t\tcout<<now.ans<<\"\\n\";\n\t\t}\n\t\telse if(op==2){\n\t\t\tint k;ll val; cin>>k>>val;\n\t\t\tupdate(1,1,n,k,val);\n\t\t}\n\t}\n}\n",
      "metadataSource": "ai-maintained",
      "metadataUpdatedAt": "2026-06-02T02:19:08.873Z"
    },
    {
      "id": "数据结构-中序波兰式求解-c-法则-cpp",
      "title": "中序波兰式求解（c++法则）",
      "fileName": "中序波兰式求解（c++法则）.cpp",
      "relativePath": "模板库/数据结构/中序波兰式求解（c++法则）.cpp",
      "originalFolders": [
        "模板库",
        "数据结构"
      ],
      "layers": [
        "数据结构",
        "其他结构"
      ],
      "note": "放置不便细分到其他专题的数据结构模板。",
      "difficulty": "基础",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "数据结构",
        "其他结构",
        "中序波兰式求解（c++法则）"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\n// 判断当前位置是否属于数字的一部分：\r\n// 允许整数、小数，以及作为负号的 '-'.\r\nbool Isdigit(string line, int i)\r\n{\r\n\t// 这里的“数字字符”不只是 0~9，\r\n\t// 还要把“合法的一元负号”和小数点一起视作数字的一部分。\r\n\t// 例如 \"-12.5\" 在扫描时应该被整体识别成一个数，而不是 '-' 和数字分开处理。\r\n\treturn isdigit(line[i]) || line[i] == '-' && (i == 0 || (i > 0 && line[i - 1] != ')' && !isdigit(line[i - 1]))) || line[i] == '.';\r\n}\r\n// 从左括号开始提取一整段匹配括号内部的表达式。\r\nstring match(string line, int &i)\r\n{\r\n\tint cnt = 1;\r\n\tstring ans;\r\n\t++i;\r\n\twhile (i < line.size())\r\n\t{\r\n\t\t// 只有在“当前看到右括号，且括号层数正好回到 1”时，\r\n\t\t// 才说明最外层这对括号已经完整匹配结束。\r\n\t\tif (line[i] == ')' && cnt == 1)\r\n\t\t\tbreak;\r\n\t\tif (line[i] == '(')\r\n\t\t\t++cnt;\r\n\t\telse if (line[i] == ')')\r\n\t\t\t--cnt;\r\n\t\t// 只把最外层括号内部的内容收进 ans，不把包裹它的那对括号本身放进去。\r\n\t\tans += line[i++];\r\n\t}\r\n\treturn ans;\r\n}\r\n// 注意减法、除法的顺序：栈顶元素是右操作数。\r\ndouble cal(double t1, double t2, char op)\r\n{\r\n\t// 注意这里的参数顺序：\r\n\t// t1 是后弹出的“右操作数”，t2 是先弹出的“左操作数”。\r\n\t// 所以减法和除法必须写成 t2-t1、t2/t1。\r\n\tif (op == '+')\r\n\t\treturn t1 + t2;\r\n\tif (op == '-')\r\n\t\treturn t2 - t1;\r\n\tif (op == '*')\r\n\t\treturn t1 * t2;\r\n\tif (op == '/')\r\n\t\treturn t2 / t1;\r\n}\r\n// 先弹出两个数和一个运算符，完成一次栈顶计算。\r\nvoid fstcal(stack<pair<double, bool>> &nums, stack<char> &ops)\r\n{\r\n\tauto t1 = nums.top();\r\n\tnums.pop();\r\n\tauto t2 = nums.top();\r\n\tnums.pop();\r\n\t// 只要两个操作数里有一个是浮点数，这一步计算结果就必须继续按浮点数保留。\r\n\tbool f = t1.second || t2.second;\r\n\tchar op = ops.top();\r\n\tops.pop();\r\n\tdouble t = cal(t1.first, t2.first, op);\r\n\t// 若当前表达式一直都是整数运算，就把结果截成 long long 风格，\r\n\t// 保持和题目里“整数表达式按整数算”的规则一致。\r\n\tt = f ? t : (ll)t;\r\n\tnums.push({t, f});\r\n}\r\n// 把当前栈里能算的低优先级运算全部算完。\r\nvoid calstack(stack<pair<double, bool>> &nums, stack<char> &ops)\r\n{\r\n\t// 这里会把栈里现有的低优先级运算全部结清。\r\n\t// 它通常在遇到新的 + / - 时调用，因为 + 和 - 不能越过之前同级的运算。\r\n\twhile (nums.size() >= 2 && !ops.empty())\r\n\t{\r\n\t\tfstcal(nums, ops);\r\n\t}\r\n}\r\n// 读出一个完整数字，并记录它是否是浮点数。\r\ndouble getnum(string line, int &i, bool &f)\r\n{\r\n\tstring ans;\r\n\twhile (Isdigit(line, i))\r\n\t{\r\n\t\t// 扫描到小数点时，说明这个数和后续涉及它的计算都要转成浮点语义。\r\n\t\tif (line[i] == '.')\r\n\t\t\tf = 1;\r\n\t\tans.push_back(line[i++]);\r\n\t}\r\n\t// 外层 while 结束时 i 已经多走了一位，回退一格交给主循环统一 ++i。\r\n\t--i;\r\n\treturn stod(ans);\r\n}\r\n// 递归求值：括号内部会再次调用 solve。\r\ndouble solve(string line, bool &flag)\r\n{\r\n\t// 先粗略扫一遍当前表达式里有没有小数点。\r\n\t// 这决定了最终输出时是按整数还是浮点数格式保留。\r\n\tfor (int i = 0; i < line.size(); ++i)\r\n\t\tif (line[i] == '.')\r\n\t\t{\r\n\t\t\tflag = true;\r\n\t\t\tbreak;\r\n\t\t}\r\n\tint i = 0;\r\n\tstack<pair<double, bool>> nums;\r\n\tstack<char> ops;\r\n\twhile (i < line.size())\r\n\t{\r\n\t\tif (line[i] == '-' && i + 1 < line.size() && line[i + 1] == '(' && (i == 0 || i > 0 && !isdigit(line[i - 1]) && line[i - 1] != ')'))\r\n\t\t{\r\n\t\t\t// 这一分支专门处理形如 \"-(...)\" 的一元负号。\r\n\t\t\t// 它不是减法，而是先把括号里的整体值算出来，再统一取反。\r\n\t\t\t++i;\r\n\t\t\tstring m = match(line, i);\r\n\t\t\tbool f = false;\r\n\t\t\tdouble t = -solve(m, f);\r\n\t\t\tt = f ? t : (ll)t;\r\n\t\t\tnums.push({t, f});\r\n\t\t\t// 若前面堆着 * 或 /，说明当前这个整体值一出来就该立刻参与高优先级计算。\r\n\t\t\tif (!ops.empty() && (ops.top() == '*' || ops.top() == '/'))\r\n\t\t\t\tfstcal(nums, ops);\r\n\t\t}\r\n\t\telse if (Isdigit(line, i))\r\n\t\t{\r\n\t\t\t// 普通数字分支：读出一个完整数字并压入数栈。\r\n\t\t\tbool f = false;\r\n\t\t\tdouble t = getnum(line, i, f);\r\n\t\t\tnums.push({t, f});\r\n\t\t\t// 和上面同理，若前面等着乘除，就先把高优先级运算结掉。\r\n\t\t\tif (!ops.empty() && (ops.top() == '*' || ops.top() == '/'))\r\n\t\t\t\tfstcal(nums, ops);\r\n\t\t}\r\n\t\telse\r\n\t\t{\r\n\t\t\tif (line[i] == '(')\r\n\t\t\t{\r\n\t\t\t\t// 普通括号分支：先递归算出括号内部的值，再把它当成一个普通数字压栈。\r\n\t\t\t\tstring m = match(line, i);\r\n\t\t\t\tbool f = false;\r\n\t\t\t\tdouble t = solve(m, f);\r\n\t\t\t\tt = f ? t : (ll)t;\r\n\t\t\t\tnums.push({t, f});\r\n\t\t\t\tif (!ops.empty() && (ops.top() == '*' || ops.top() == '/'))\r\n\t\t\t\t\tfstcal(nums, ops);\r\n\t\t\t}\r\n\t\t\telse if (line[i] == '+' || line[i] == '-')\r\n\t\t\t{\r\n\t\t\t\t// 遇到 + 或 - 时，说明之前栈里的同级运算优先级已经不低于当前运算，\r\n\t\t\t\t// 可以全部结算后再把当前运算符压栈。\r\n\t\t\t\tcalstack(nums, ops);\r\n\t\t\t\tops.push(line[i]);\r\n\t\t\t}\r\n\t\t\telse if (line[i] == '*' || line[i] == '/')\r\n\t\t\t{\r\n\t\t\t\t// * 和 / 先压栈，等右操作数读出来后再立刻结算。\r\n\t\t\t\tops.push(line[i]);\r\n\t\t\t}\r\n\t\t}\r\n\t\t++i;\r\n\t}\r\n\t// 扫描完整个表达式后，把栈里还没做完的低优先级运算统一结算。\r\n\tcalstack(nums, ops);\r\n\treturn nums.top().first;\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tstring line;\r\n\tgetline(cin, line);\r\n\tbool flag = false;\r\n\t// solve 会递归处理整条中序表达式，并通过 flag 告诉主函数结果是否应按浮点输出。\r\n\tdouble ans = solve(line, flag);\r\n\tif (flag)\r\n\t\tcout << fixed << setprecision(3) << ans;\r\n\telse\r\n\t\tcout << fixed << setprecision(0) << (ll)ans;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "搜索-dfs全排列-cpp",
      "title": "dfs全排列",
      "fileName": "dfs全排列.cpp",
      "relativePath": "模板库/搜索/dfs全排列.cpp",
      "originalFolders": [
        "模板库",
        "搜索"
      ],
      "layers": [
        "基础算法",
        "搜索"
      ],
      "note": "包含 DFS、BFS 等基础搜索策略。",
      "difficulty": "中级",
      "scenarios": [
        "状态遍历",
        "搜索最短步数或枚举方案"
      ],
      "signals": [
        "需要枚举可达状态",
        "图或网格逐层扩展"
      ],
      "risks": [
        "回溯恢复容易遗漏",
        "去重不完整会导致重复搜索"
      ],
      "keywords": [
        "基础算法",
        "搜索",
        "dfs全排列",
        "递归",
        "回溯"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nconst int N = 1e5 + 5;\r\nint a[N], n;\r\nbool vis[N];\r\n// step 表示当前要填写排列的第几个位置。\r\nvoid dfs(int step)\r\n{\r\n\tif (step > n)\r\n\t{\r\n\t\t// 当 step 走到 n+1，说明前 n 个位置都已经填完，得到一个完整排列。\r\n\t\tfor (int i = 1; i <= n; ++i)\r\n\t\t\tcout << a[i];\r\n\t\tcout << \"\\n\";\r\n\t\treturn;\r\n\t}\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t{\r\n\t\t// 每个数字只能使用一次。\r\n\t\tif (!vis[i])\r\n\t\t{\r\n\t\t\t// 先标记数字 i 已经被放进当前排列。\r\n\t\t\tvis[i] = true;\r\n\t\t\t// 把数字 i 放到第 step 个位置。\r\n\t\t\ta[step] = i;\r\n\t\t\t// 继续递归去填写下一个位置。\r\n\t\t\tdfs(step + 1);\r\n\t\t\t// 回溯：撤销当前选择。\r\n\t\t\t// 这样后面的数字才能再次尝试填到这个位置上。\r\n\t\t\tvis[i] = false;\r\n\t\t}\r\n\t}\r\n}\r\nint main()\r\n{\r\n\tcin >> n;\r\n\t// 从第 1 个位置开始逐步构造排列。\r\n\tdfs(1);\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-并查集模板-cpp",
      "title": "并查集模板",
      "fileName": "并查集模板.cpp",
      "relativePath": "模板库/图论/并查集模板.cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "数据结构",
        "并查集"
      ],
      "note": "并查集既可用于图论，也适合作为独立数据结构查看。",
      "difficulty": "中级",
      "scenarios": [
        "连通块维护",
        "集合合并判定"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "并查集合并和路径压缩容易漏写",
        "边数与节点编号边界容易出错"
      ],
      "keywords": [
        "数据结构",
        "并查集",
        "并查集模板",
        "连通块",
        "合并查询"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nconst int N = 200005;\r\nint fa[N];\r\nint sz[N];\r\n// 初始化：每个点单独成一个集合，集合大小为 1。\r\nvoid init(int n)\r\n{\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t{\r\n\t\tfa[i] = i;\r\n\t\tsz[i] = 1;\r\n\t}\r\n}\r\n\r\nint find(int x)\r\n{\r\n\t// 若 x 不是根，就递归找到根，并把路径上所有点直接挂到根上。\r\n\t// 这就是路径压缩：后续再查这些点时会快很多。\r\n\treturn fa[x] == x ? x : (fa[x] = find(fa[x]));\r\n}\r\n\r\n// 按大小合并：总是把小集合挂到大集合上。\r\nvoid unite(int x, int y)\r\n{\r\n\t// 合并前先各自找到所在集合的根，真正参与合并的是“集合”，不是原始点编号。\r\n\tint rx = find(x);\r\n\tint ry = find(y);\r\n\tif (rx != ry)\r\n\t{\r\n\t\t// 按大小合并：把小集合挂到大集合上，避免树退化得太深。\r\n\t\tif (sz[rx] < sz[ry])\r\n\t\t\tswap(rx, ry);\r\n\t\tfa[ry] = rx;\r\n\t\t// 新根对应集合的大小，要把被并进来的那一整棵树也算进去。\r\n\t\tsz[rx] += sz[ry];\r\n\t}\r\n}\r\n\r\nint main()\r\n{\r\n\tint n, m;\r\n\tcin >> n >> m;\r\n\tinit(n);\r\n\twhile (m--)\r\n\t{\r\n\t\tint op, x, y;\r\n\t\tcin >> op >> x >> y;\r\n\t\t// op==1 表示合并两个集合；\r\n\t\t// 否则就询问它们当前是否已经在同一个连通块里。\r\n\t\tif (op == 1)\r\n\t\t\tunite(x, y);\r\n\t\telse\r\n\t\t{\r\n\t\t\tif (find(x) == find(y))\r\n\t\t\t\tcout << \"Y\" << \"\\n\";\r\n\t\t\telse\r\n\t\t\t\tcout << \"N\" << \"\\n\";\r\n\t\t}\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-链式前向星-cpp",
      "title": "链式前向星",
      "fileName": "链式前向星.cpp",
      "relativePath": "模板库/图论/链式前向星.cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "图论",
        "存图与遍历"
      ],
      "note": "适合高效存储稀疏图。",
      "difficulty": "中级",
      "scenarios": [
        "稀疏图存图",
        "图遍历建模"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "图论",
        "存图与遍历",
        "链式前向星"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nconst int N = 1e5 + 5;\r\nconst int M = 1e5 + 5;\r\nstruct Edge\r\n{\r\n\tint to, next, w;\r\n} edge[M];\r\nint head[N], cnt;\r\n// 加边后，新边会挂到 head[u] 指向的链表最前面。\r\nvoid add_edge(int u, int v, int w)\r\n{\r\n\tedge[++cnt].to = v;\r\n\tedge[cnt].w = w;\r\n\tedge[cnt].next = head[u];\r\n\thead[u] = cnt;\r\n}\r\nint main()\r\n{\r\n\tint n, m;\r\n\tcin >> n >> m;\r\n\tfor (int i = 0; i < m; ++i)\r\n\t{\r\n\t\tint u, v, w;\r\n\t\tcin >> u >> v >> w;\r\n\t\tadd_edge(u, v, w);\r\n\t}\r\n\tint u0;\r\n\tcin >> u0;\r\n\t// 沿着 u0 的邻接链表向后遍历即可访问所有出边。\r\n\tfor (int i = head[u0]; i != 0; i = edge[i].next)\r\n\t{\r\n\t\tint v = edge[i].to;\r\n\t\tint w = edge[i].w;\r\n\t\tcout << v << \" \" << w << \"\\n\";\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-拓扑排序-kahn-邻接表-cpp",
      "title": "拓扑排序-kahn+邻接表",
      "fileName": "拓扑排序-kahn+邻接表.cpp",
      "relativePath": "模板库/图论/拓扑排序-kahn+邻接表.cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "图论",
        "拓扑排序"
      ],
      "note": "用于 DAG 依赖关系处理。",
      "difficulty": "中级",
      "scenarios": [
        "依赖关系排序",
        "DAG 处理"
      ],
      "signals": [
        "存在先后依赖",
        "图中应无环"
      ],
      "risks": [
        "有环时结果无效",
        "入度初始化容易漏点"
      ],
      "keywords": [
        "图论",
        "拓扑排序",
        "拓扑排序-kahn+邻接表",
        "入度",
        "DAG"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst int MAXN = 100005;\r\nvector<int> adj[MAXN];\r\nint in_degree[MAXN];\r\nint n, m;\r\n// Kahn 算法：不断取出入度为 0 的点，删除它的出边。\r\nvector<int> topo_sort()\r\n{\r\n\tqueue<int> q;\r\n\tvector<int> result;\r\n\t// 所有入度为 0 的点都可以作为拓扑序的当前起点，先全部入队。\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t\tif (in_degree[i] == 0)\r\n\t\t\tq.push(i);\r\n\twhile (!q.empty())\r\n\t{\r\n\t\tint u = q.front();\r\n\t\tq.pop();\r\n\t\t// 一个点出队，说明它已经可以确定排在当前拓扑序的下一位。\r\n\t\tresult.push_back(u);\r\n\t\tfor (int v : adj[u])\r\n\t\t{\r\n\t\t\t// “删掉 u 的出边”在代码里的体现，就是把后继点的入度减 1。\r\n\t\t\t--in_degree[v];\r\n\t\t\t// 某个点一旦入度减到 0，说明它前面的依赖已经全部处理完，可以入队。\r\n\t\t\tif (in_degree[v] == 0)\r\n\t\t\t\tq.push(v);\r\n\t\t}\r\n\t}\r\n\t// 若最后没取满 n 个点，说明仍有一些点始终无法把入度降到 0，图里就存在环。\r\n\tif (result.size() < n)\r\n\t\treturn {};\r\n\treturn result;\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tcin >> n >> m;\r\n\tfor (int i = 0; i < m; ++i)\r\n\t{\r\n\t\tint u, v;\r\n\t\tcin >> u >> v;\r\n\t\tadj[u].push_back(v);\r\n\t\tin_degree[v]++;\r\n\t}\r\n\tvector<int> res = topo_sort();\r\n\tif (res.empty())\r\n\t\tcout << \"Cycle detected\";\r\n\telse\r\n\t{\r\n\t\tfor (int x : res)\r\n\t\t\tcout << x << \" \";\r\n\t\tcout << \"\\n\";\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-线段树多懒标记配合-cpp",
      "title": "线段树多懒标记配合",
      "fileName": "线段树多懒标记配合.cpp",
      "relativePath": "模板库/图论/线段树多懒标记配合.cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "数据结构",
        "线段树"
      ],
      "note": "虽然原文件位于图论目录，但展示层统一归到线段树专题。",
      "difficulty": "进阶",
      "scenarios": [
        "区间修改与查询",
        "需要对数级维护区间信息"
      ],
      "signals": [
        "多次修改与查询",
        "需要快速维护区间或前缀信息"
      ],
      "risks": [
        "懒标记下传遗漏",
        "区间边界和 pushup 易写错"
      ],
      "keywords": [
        "数据结构",
        "线段树",
        "线段树多懒标记配合",
        "区间",
        "懒标记"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nusing ll=long long;\r\nconst int N=1e6+5;\r\nbool is_set[N*4];\r\nll tree[N*4],m_set[N*4],m_add[N*4],a[N];\r\nint n,q;\r\nvoid build(int p,int l,int r){\r\n\tif(l==r){\r\n\t\ttree[p]=a[l];\r\n\t\treturn;\r\n\t}\r\n\tint m=(l+r)>>1;\r\n\tbuild(p<<1,l,m);\r\n\tbuild(p<<1|1,m+1,r);\r\n\ttree[p]=max(tree[p<<1],tree[p<<1|1]);\r\n}\r\nvoid push_down(int p){\r\n\tif(is_set[p]){\r\n\t\ttree[p<<1]=tree[p<<1|1]=m_set[p];\r\n\t\tm_set[p<<1]=m_set[p<<1|1]=m_set[p];\r\n\t\tis_set[p<<1]=is_set[p<<1|1]=true;\r\n\t\tm_add[p<<1]=m_add[p<<1|1]=0;\r\n\t\tis_set[p]=false;\r\n\t\tm_set[p]=0;\r\n\t}\r\n\tif(m_add[p]!=0){\r\n\t\ttree[p<<1]+=m_add[p];\r\n\t\ttree[p<<1|1]+=m_add[p];\r\n\t\tm_add[p<<1]+=m_add[p];\r\n\t\tm_add[p<<1|1]+=m_add[p];\r\n\t\tm_add[p]=0;\r\n\t}\r\n}\r\nvoid update(int p,int l,int r,int ql,int qr,ll v,int op){\r\n\tif(op==1){\r\n\t\tif(ql<=l&&r<=qr){\r\n\t\t\tm_add[p]=0;\r\n\t\t\tm_set[p]=v;\r\n\t\t\tis_set[p]=true;\r\n\t\t\ttree[p]=v;\r\n\t\t\treturn;\r\n\t\t}\r\n\t\tpush_down(p);\r\n\t\tint m=(l+r)>>1;\r\n\t\tif(ql<=m) update(p<<1,l,m,ql,qr,v,op);\r\n\t\tif(m<qr) update(p<<1|1,m+1,r,ql,qr,v,op);\r\n\t\ttree[p]=max(tree[p<<1],tree[p<<1|1]);\r\n\t}\r\n\telse if(op==2){\r\n\t\tif(ql<=l&&r<=qr){\r\n\t\t\tm_add[p]+=v;\r\n\t\t\ttree[p]+=v;\r\n\t\t\treturn;\r\n\t\t}\r\n\t\tpush_down(p);\r\n\t\tint m=(l+r)>>1;\r\n\t\tif(ql<=m) update(p<<1,l,m,ql,qr,v,op);\r\n\t\tif(m<qr) update(p<<1|1,m+1,r,ql,qr,v,op);\r\n\t\ttree[p]=max(tree[p<<1],tree[p<<1|1]);\r\n\t}\r\n}\r\nll query(int p,int l,int r,int ql,int qr){\r\n\tif(ql<=l&&r<=qr) return tree[p];\r\n\tpush_down(p);\r\n\tll ans=LLONG_MIN;\r\n\tint m=(l+r)>>1;\r\n\tif(ql<=m) ans=max(query(p<<1,l,m,ql,qr),ans);\r\n\tif(m<qr) ans=max(query(p<<1|1,m+1,r,ql,qr),ans);\r\n\treturn ans;\r\n}\r\nint main(){\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tcin>>n>>q;\r\n\tfor(int i=1;i<=n;++i) cin>>a[i];\r\n\tbuild(1,1,n);\r\n\tfor(int i=1;i<=q;++i){\r\n\t\tint op; cin>>op;\r\n\t\tif(op==3){\r\n\t\t\tint l,r; cin>>l>>r;\r\n\t\t\tcout<<query(1,1,n,l,r)<<\"\\n\";\r\n\t\t}\r\n\t\telse{\r\n\t\t\tint l,r; ll x; cin>>l>>r>>x;\r\n\t\t\tupdate(1,1,n,l,r,x,op);\r\n\t\t}\r\n\t}\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-线段树区间乘加配合-cpp",
      "title": "线段树区间乘加配合",
      "fileName": "线段树区间乘加配合.cpp",
      "relativePath": "模板库/图论/线段树区间乘加配合.cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "数据结构",
        "线段树"
      ],
      "note": "虽然原文件位于图论目录，但展示层统一归到线段树专题。",
      "difficulty": "进阶",
      "scenarios": [
        "区间修改与查询",
        "需要对数级维护区间信息"
      ],
      "signals": [
        "多次修改与查询",
        "需要快速维护区间或前缀信息"
      ],
      "risks": [
        "懒标记下传遗漏",
        "区间边界和 pushup 易写错"
      ],
      "keywords": [
        "数据结构",
        "线段树",
        "线段树区间乘加配合",
        "区间",
        "懒标记"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nusing ll=long long;\r\nconst int N=1e5+5;\r\nll a[N],tree[N*4],add[N*4],mul[N*4],n,M,q;\r\nvoid build(int p,int l,int r){\r\n\tif(l==r){\r\n\t\ttree[p]=a[l]%M;\r\n\t\treturn;\r\n\t}\r\n\tint m=(l+r)>>1;\r\n\tbuild(p<<1,l,m);\r\n\tbuild(p<<1|1,m+1,r);\r\n\ttree[p]=(tree[p<<1]+tree[p<<1|1])%M;\r\n}\r\nvoid apply(int p,int l,int r,ll mulv,ll addv){\r\n\tint len=r-l+1;\r\n\ttree[p]=(tree[p]*mulv%M+addv*len%M)%M;\r\n\tmul[p]=mul[p]*mulv%M;\r\n\tadd[p]=(add[p]*mulv%M+addv)%M;\r\n}\r\nvoid push_down(int p,int l,int r){\r\n\tif(mul[p]==1&&add[p]==0) return;\r\n\tint m=(l+r)>>1;\r\n\tapply(p<<1,l,m,mul[p],add[p]);\r\n\tapply(p<<1|1,m+1,r,mul[p],add[p]);\r\n\tmul[p]=1;\r\n\tadd[p]=0;\r\n}\r\nvoid update(int p,int l,int r,int ql,int qr,ll k,int op){\r\n\tif(op==2){\r\n\t\tif(ql<=l&&r<=qr){\r\n\t\t\tapply(p,l,r,1,k);\r\n\t\t\treturn;\r\n\t\t}\r\n\t\tpush_down(p,l,r);\r\n\t\tint m=(l+r)>>1;\r\n\t\tif(ql<=m) update(p<<1,l,m,ql,qr,k,op);\r\n\t\tif(m<qr) update(p<<1|1,m+1,r,ql,qr,k,op);\r\n\t\ttree[p]=(tree[p<<1]+tree[p<<1|1])%M;\r\n\t}\r\n\telse if(op==1){\r\n\t\tif(ql<=l&&r<=qr){\r\n\t\t\tapply(p,l,r,k,0);\r\n\t\t\treturn;\r\n\t\t}\r\n\t\tpush_down(p,l,r);\r\n\t\tint m=(l+r)>>1;\r\n\t\tif(ql<=m) update(p<<1,l,m,ql,qr,k,op);\r\n\t\tif(m<qr) update(p<<1|1,m+1,r,ql,qr,k,op);\r\n\t\ttree[p]=(tree[p<<1]+tree[p<<1|1])%M;\r\n\t}\r\n}\r\nll query(int p,int l,int r,int ql,int qr){\r\n\tif(ql<=l&&r<=qr) return tree[p];\r\n\tpush_down(p,l,r);\r\n\tint m=(l+r)>>1;\r\n\tll sum=0;\r\n\tif(ql<=m) sum=(sum+query(p<<1,l,m,ql,qr))%M;\r\n\tif(m<qr) sum=(sum+query(p<<1|1,m+1,r,ql,qr))%M;\r\n\treturn sum; \r\n}\r\nint main(){\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tfor(int i=0;i<N*4;++i) mul[i]=1;\r\n\tcin>>n>>q>>M;\r\n\tfor(int i=1;i<=n;++i) cin>>a[i];\r\n\tbuild(1,1,n);\r\n\tfor(int i=1;i<=q;++i){\r\n\t\tint op; cin>>op;\r\n\t\tif(op==3){\r\n\t\t\tint l,r; cin>>l>>r;\r\n\t\t\tcout<<query(1,1,n,l,r)<<\"\\n\";\r\n\t\t}\r\n\t\telse{\r\n\t\t\tint l,r; ll k; cin>>l>>r>>k;\r\n\t\t\tupdate(1,1,n,l,r,k,op);\r\n\t\t}\r\n\t}\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-线段树区间修改加区间和查询-cpp",
      "title": "线段树区间修改加区间和查询",
      "fileName": "线段树区间修改加区间和查询.cpp",
      "relativePath": "模板库/图论/线段树区间修改加区间和查询.cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "数据结构",
        "线段树"
      ],
      "note": "虽然原文件位于图论目录，但展示层统一归到线段树专题。",
      "difficulty": "进阶",
      "scenarios": [
        "区间修改与查询",
        "需要对数级维护区间信息"
      ],
      "signals": [
        "多次修改与查询",
        "需要快速维护区间或前缀信息"
      ],
      "risks": [
        "懒标记下传遗漏",
        "区间边界和 pushup 易写错"
      ],
      "keywords": [
        "数据结构",
        "线段树",
        "线段树区间修改加区间和查询",
        "区间",
        "懒标记"
      ],
      "code": "#include <iostream>\r\nusing namespace std;\r\n\r\n// 1. 定义常量和全局数组\r\nconst int MAXN = 100005;     // 根据题目要求的最大 N 进行修改\r\nlong long A[MAXN];           // 存原数组数据\r\nlong long tree[MAXN * 4];    // 线段树数组（必须开 4 倍大小！）\r\nlong long mark[MAXN * 4];    // 懒标记数组（必须开 4 倍大小！）\r\n\r\n// 2. 下传懒标记 (PushDown)\r\n// 将节点 p 的懒标记传递给左右子节点\r\nvoid push_down(int p, int l, int r) {\r\n    if (mark[p] != 0) { // 如果有标记才下传\r\n        int mid = (l + r) / 2;\r\n        \r\n        // 传递给左孩子 (p * 2)\r\n        mark[p * 2] += mark[p];\r\n        tree[p * 2] += mark[p] * (mid - l + 1); // 左子树的值增加: 标记 * 左子树元素个数\r\n        \r\n        // 传递给右孩子 (p * 2 + 1)\r\n        mark[p * 2 + 1] += mark[p];\r\n        tree[p * 2 + 1] += mark[p] * (r - mid); // 右子树的值增加: 标记 * 右子树元素个数\r\n        \r\n        // 清空当前节点的标记\r\n        mark[p] = 0;\r\n    }\r\n}\r\n\r\n// 3. 建树 (Build)\r\n// 初始化线段树，用法: build(1, 1, n);\r\nvoid build(int p, int l, int r) {\r\n    if (l == r) {\r\n        tree[p] = A[l]; // 到达叶子节点，赋值\r\n        return;\r\n    }\r\n    int mid = (l + r) / 2;\r\n    build(p * 2, l, mid);          // 递归建立左子树\r\n    build(p * 2 + 1, mid + 1, r);  // 递归建立右子树\r\n    \r\n    // PushUp: 向上更新父节点的值\r\n    tree[p] = tree[p * 2] + tree[p * 2 + 1]; \r\n}\r\n\r\n// 4. 区间修改 (Update)\r\n// 将区间 [ql, qr] 内的每个数加上 v\r\n// 用法: update(1, 1, n, ql, qr, v);\r\nvoid update(int p, int l, int r, int ql, int qr, long long v) {\r\n    // 情况1：当前区间被查询区间完全包含\r\n    if (ql <= l && r <= qr) {\r\n        tree[p] += v * (r - l + 1); // 更新当前节点的值\r\n        mark[p] += v;               // 打上懒标记\r\n        return;\r\n    }\r\n    \r\n    // 情况2：不能完全包含，必须切分，先下传标记！\r\n    push_down(p, l, r);\r\n    \r\n    int mid = (l + r) / 2;\r\n    // 如果左半边有交集，修改左半边\r\n    if (ql <= mid) update(p * 2, l, mid, ql, qr, v);\r\n    // 如果右半边有交集，修改右半边\r\n    if (qr > mid)  update(p * 2 + 1, mid + 1, r, ql, qr, v);\r\n    \r\n    // PushUp: 子节点修改完了，更新父节点\r\n    tree[p] = tree[p * 2] + tree[p * 2 + 1];\r\n}\r\n\r\n// 5. 区间查询 (Query)\r\n// 查询区间 [ql, qr] 的和\r\n// 用法: query(1, 1, n, ql, qr);\r\nlong long query(int p, int l, int r, int ql, int qr) {\r\n    // 情况1：当前区间被查询区间完全包含\r\n    if (ql <= l && r <= qr) {\r\n        return tree[p];\r\n    }\r\n    \r\n    // 情况2：不能完全包含，先下传标记！\r\n    push_down(p, l, r);\r\n    \r\n    int mid = (l + r) / 2;\r\n    long long sum = 0;\r\n    // 如果左半边有交集，去左边查\r\n    if (ql <= mid) sum += query(p * 2, l, mid, ql, qr);\r\n    // 如果右半边有交集，去右边查\r\n    if (qr > mid)  sum += query(p * 2 + 1, mid + 1, r, ql, qr);\r\n    \r\n    return sum;\r\n}\r\n\r\n// ================= 主函数 =================\r\nint main() {\r\n    // 优化 C++ 的输入输出速度（竞赛必备）\r\n    ios::sync_with_stdio(false);\r\n    cin.tie(nullptr);\r\n\r\n    int n, m; // n 是数组长度，m 是操作次数\r\n    // 假设题目输入格式为：先输入 n 和 m\r\n    if (!(cin >> n >> m)) return 0; \r\n\r\n    // 读取原数组，强烈建议从下标 1 开始存！\r\n    for (int i = 1; i <= n; i++) {\r\n        cin >> A[i];\r\n    }\r\n\r\n    // 1. 建树：当前节点编号为1，代表的区间是 [1, n]\r\n    build(1, 1, n);\r\n\r\n    // 2. 处理 m 次操作\r\n    while (m--) {\r\n        int op, x, y;\r\n        long long k;\r\n        cin >> op; // 读取操作类型\r\n        \r\n        if (op == 1) {\r\n            // 操作 1：区间修改（例如将 [x, y] 每个数加上 k）\r\n            cin >> x >> y >> k;\r\n            update(1, 1, n, x, y, k);\r\n        } \r\n        else if (op == 2) {\r\n            // 操作 2：区间查询（例如查询 [x, y] 的和）\r\n            cin >> x >> y;\r\n            cout << query(1, 1, n, x, y) << \"\\n\"; // 输出要换行\r\n        }\r\n    }\r\n\r\n    return 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-线段树实现静态区间最值查询-cpp",
      "title": "线段树实现静态区间最值查询",
      "fileName": "线段树实现静态区间最值查询.cpp",
      "relativePath": "模板库/图论/线段树实现静态区间最值查询.cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "数据结构",
        "线段树"
      ],
      "note": "虽然原文件位于图论目录，但展示层统一归到线段树专题。",
      "difficulty": "进阶",
      "scenarios": [
        "区间修改与查询",
        "需要对数级维护区间信息"
      ],
      "signals": [
        "多次修改与查询",
        "需要快速维护区间或前缀信息"
      ],
      "risks": [
        "懒标记下传遗漏",
        "区间边界和 pushup 易写错"
      ],
      "keywords": [
        "数据结构",
        "线段树",
        "线段树实现静态区间最值查询",
        "区间",
        "懒标记"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst ll Mod = 998244353;\r\nconst int N=100005;\r\nll a[N],tree[N*4],mark[N*4];\r\nvoid build(int p,int l,int r){\r\n\tif(l==r){\r\n\t\ttree[p]=a[l];\r\n\t\treturn;\r\n\t}\r\n\tint mid=(l+r)>>1;\r\n\tbuild(p*2,l,mid);\r\n\tbuild(p*2+1,mid+1,r);\r\n\ttree[p]=max(tree[p*2],tree[p*2+1]);\r\n}\r\nvoid push_down(int p,int l,int r){\r\n\tif(mark[p]!=0){\r\n\t\tint mid=(l+r)>>1;\r\n\t\tmark[p*2]=max(mark[p*2],mark[p]);\r\n\t\ttree[p*2]=max(tree[p*2],mark[p*2]);\r\n\t\tmark[p*2+1]=max(mark[p*2+1],mark[p]);\r\n\t\ttree[p*2+1]=max(tree[p*2+1],mark[p*2+1]);\r\n\t\tmark[p]=0;\r\n\t}\r\n}\r\nll query(int p,int l,int r,int ql,int qr){\r\n\tif(ql<=l&&r<=qr)\r\n\t\treturn tree[p];\r\n\tpush_down(p,l,r);\r\n\tint mid=(l+r)>>1;\r\n\tll ans=0;\r\n\tif(ql<=mid) ans=max(ans,query(p*2,l,mid,ql,qr));\r\n\tif(mid<qr) ans=max(ans,query(p*2+1,mid+1,r,ql,qr));\r\n\treturn ans; \r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tint n,m;\r\n\tcin>>n>>m;\r\n\tfor(int i=1;i<=n;++i)\r\n\t\tcin>>a[i];\r\n\tbuild(1,1,n);\r\n\twhile(m--){\r\n\t\tint x,y;\r\n\t\tcin>>x>>y;\r\n\t\tcout<<query(1,1,n,x,y)<<\"\\n\";\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-dijkstra-链式前向星-cpp",
      "title": "dijkstra+链式前向星.",
      "fileName": "dijkstra+链式前向星..cpp",
      "relativePath": "模板库/图论/dijkstra+链式前向星..cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "图论",
        "最短路"
      ],
      "note": "适用于非负权单源最短路场景。",
      "difficulty": "中级",
      "scenarios": [
        "非负权单源最短路",
        "稀疏图路径计算"
      ],
      "signals": [
        "题目出现最短路",
        "带权图距离关系"
      ],
      "risks": [
        "含负权边时不能直接使用",
        "堆中旧状态若不丢弃会影响效率"
      ],
      "keywords": [
        "图论",
        "最短路",
        "dijkstra+链式前向星.",
        "堆优化",
        "非负边权"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst ll INF = 0x3f3f3f3f3f3f3f3f;\r\nconst int MAXN = 100005;\r\nconst int MAXM = 500005;\r\nstruct Edge\r\n{\r\n\tint to, next, w;\r\n} edge[MAXM];\r\nint head[MAXN], cnt = 0;\r\nvoid add_edge(int u, int v, int w)\r\n{\r\n\t// 把新边挂到 u 的邻接链表表头，后面遍历时就能顺着 next 找到所有出边。\r\n\tedge[++cnt] = {v, head[u], w};\r\n\thead[u] = cnt;\r\n}\r\n// Dijkstra 适用于非负边权最短路。\r\n// dist[v] 表示起点到 v 的当前最短路估计值。\r\nvoid dijkstra(int start, int n)\r\n{\r\n\tvector<ll> dist(n + 1, INF);\r\n\t// 起点到自己距离为 0，这是所有松弛过程的出发点。\r\n\tdist[start] = 0;\r\n\t// 小根堆里存的是“当前发现的一条到某点的最短路估计值”。\r\n\tpriority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<pair<ll, int>>> pq;\r\n\tpq.push({0, start});\r\n\twhile (!pq.empty())\r\n\t{\r\n\t\tll d = pq.top().first;\r\n\t\tint u = pq.top().second;\r\n\t\tpq.pop();\r\n\t\t// 若取出的状态不是最新最短路，直接丢弃。\r\n\t\t// 因为同一个点可能被多次入堆，只有 dist[u] 对应的那次才有效。\r\n\t\tif (d > dist[u])\r\n\t\t\tcontinue;\r\n\t\tfor (int i = head[u]; i != 0; i = edge[i].next)\r\n\t\t{\r\n\t\t\tint v = edge[i].to;\r\n\t\t\tint w = edge[i].w;\r\n\t\t\t// 松弛：若经过 u 再走一条边到 v 更短，就更新 dist[v]。\r\n\t\t\tif (dist[v] > dist[u] + w)\r\n\t\t\t{\r\n\t\t\t\tdist[v] = dist[u] + w;\r\n\t\t\t\t// 更新后的 dist[v] 要重新丢进堆里，让它以后也能继续扩展别人。\r\n\t\t\t\tpq.push({dist[v], v});\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t\tcout << dist[i] << \" \";\r\n}\r\nint main()\r\n{\r\n\tint n, m, tg;\r\n\tcin >> n >> m >> tg;\r\n\tfor (int i = 0; i < m; ++i)\r\n\t{\r\n\t\tint u, v, w;\r\n\t\tcin >> u >> v >> w;\r\n\t\t// 这份模板按有向图写；若题目是无向图，需要再补 add_edge(v, u, w)。\r\n\t\tadd_edge(u, v, w);\r\n\t}\r\n\r\n\tdijkstra(tg, n);\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-floyd-邻接矩阵-cpp",
      "title": "floyd+邻接矩阵",
      "fileName": "floyd+邻接矩阵.cpp",
      "relativePath": "模板库/图论/floyd+邻接矩阵.cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "图论",
        "最短路"
      ],
      "note": "适用于多源最短路或点数较小的场景。",
      "difficulty": "中级",
      "scenarios": [
        "多源最短路",
        "点数较小的全点对距离"
      ],
      "signals": [
        "题目出现最短路",
        "带权图距离关系"
      ],
      "risks": [
        "点数过大时复杂度过高",
        "初始化无穷大和自环要谨慎"
      ],
      "keywords": [
        "图论",
        "最短路",
        "floyd+邻接矩阵",
        "邻接矩阵",
        "多源最短路"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst int MAXN = 305;\r\nconst ll INF = 0x3f3f3f3f3f3f3f3f;\r\nll f[MAXN][MAXN];\r\nint main()\r\n{\r\n\t// 初始化邻接矩阵：自己到自己距离为 0，其余设为无穷大。\r\n\tfor (int i = 0; i < MAXN; ++i)\r\n\t\tfor (int j = 0; j < MAXN; ++j)\r\n\t\t\tf[i][j] = (i == j ? 0 : INF);\r\n\tint n, m;\r\n\tcin >> n >> m;\r\n\tfor (int i = 0; i < m; ++i)\r\n\t{\r\n\t\tint u, v, w;\r\n\t\tcin >> u >> v >> w;\r\n\t\tf[u][v] = min(f[u][v], (ll)w);\r\n\t}\r\n\t// Floyd 的核心顺序必须是“中转点 k 在最外层”。\r\n\tfor (int k = 1; k <= n; ++k)\r\n\t\tfor (int i = 1; i <= n; ++i)\r\n\t\t\tfor (int j = 1; j <= n; ++j)\r\n\t\t\t\tif (f[i][k] != INF && f[k][j] != INF)\r\n\t\t\t\t\tf[i][j] = min(f[i][j], f[i][k] + f[k][j]);\r\n\tint u, v;\r\n\tcin >> u >> v;\r\n\tcout << f[u][v];\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-kruskal最小生成树-cpp",
      "title": "kruskal最小生成树",
      "fileName": "kruskal最小生成树.cpp",
      "relativePath": "模板库/图论/kruskal最小生成树.cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "图论",
        "最小生成树"
      ],
      "note": "面向最小生成树专题整理。",
      "difficulty": "中级",
      "scenarios": [
        "最小生成树",
        "连通图最小代价连边"
      ],
      "signals": [
        "要求最小连通代价",
        "边权排序或贪心选边"
      ],
      "risks": [
        "并查集合并和路径压缩容易漏写",
        "边数与节点编号边界容易出错"
      ],
      "keywords": [
        "图论",
        "最小生成树",
        "kruskal最小生成树",
        "排序边"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nstruct Edge\r\n{\r\n\tint u, v, w;\r\n};\r\nint fa[100005];\r\nint find(int x)\r\n{\r\n\treturn fa[x] == x ? x : (fa[x] = find(fa[x]));\r\n}\r\n// Kruskal：按边权从小到大选边，若两端点不连通就加入生成树。\r\nll kruskal(int n, vector<Edge> &edges)\r\n{\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t\tfa[i] = i;\r\n\tsort(edges.begin(), edges.end(), [](const Edge &x, const Edge &y)\r\n\t\t { return x.w < y.w; });\r\n\tll mw = 0;\r\n\tint cnt = 0;\r\n\tfor (const auto &e : edges)\r\n\t{\r\n\t\tint rtu = find(e.u);\r\n\t\tint rtv = find(e.v);\r\n\t\tif (rtu != rtv)\r\n\t\t{\r\n\t\t\tfa[rtu] = rtv;\r\n\t\t\tmw += e.w;\r\n\t\t\t++cnt;\r\n\t\t\tif (cnt == n - 1)\r\n\t\t\t\tbreak;\r\n\t\t}\r\n\t}\r\n\r\n\treturn (cnt == n - 1) ? mw : -1;\r\n}\r\nint main()\r\n{\r\n\tint n, m;\r\n\tvector<Edge> edges;\r\n\tcin >> n >> m;\r\n\tfor (int i = 0; i < m; ++i)\r\n\t{\r\n\t\tint u, v, w;\r\n\t\tcin >> u >> v >> w;\r\n\t\tedges.push_back({u, v, w});\r\n\t}\r\n\tcout << kruskal(n, edges);\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-lca-cpp",
      "title": "LCA",
      "fileName": "LCA.cpp",
      "relativePath": "模板库/图论/LCA.cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "图论",
        "树上算法"
      ],
      "note": "用于树上最近公共祖先等问题。",
      "difficulty": "进阶",
      "scenarios": [
        "树上路径查询",
        "祖先关系判断"
      ],
      "signals": [
        "输入是一棵树",
        "答案依赖父子关系"
      ],
      "risks": [
        "深度和父节点初始化容易错",
        "倍增边界要和节点数对应"
      ],
      "keywords": [
        "图论",
        "树上算法",
        "LCA",
        "倍增",
        "祖先"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst int N = 5e5 + 5;\r\nconst int LOG = 20;\r\nvector<int> adj[N];\r\nint depth[N];\r\nint fa[N][LOG + 1];\r\n// 预处理每个点的深度和 2^i 级祖先。\r\nvoid dfs(int u, int p)\r\n{\r\n\t// 深度比父亲多 1；这里把 0 号点当成“虚父亲”，方便根的深度初始化。\r\n\tdepth[u] = depth[p] + 1;\r\n\t// fa[u][0] 就是 u 的直接父亲。\r\n\tfa[u][0] = p;\r\n\tfor (int i = 1; i <= LOG; ++i)\r\n\t\t// 倍增递推：u 的 2^i 级祖先 = “u 的 2^(i-1) 级祖先”的 2^(i-1) 级祖先。\r\n\t\tfa[u][i] = fa[fa[u][i - 1]][i - 1];\r\n\tfor (int v : adj[u])\r\n\t\tif (v != p)\r\n\t\t\t// 只往儿子递归，避免沿无向边又走回父亲。\r\n\t\t\tdfs(v, u);\r\n}\r\n// 先把更深的点跳到同一深度，再一起向上跳。\r\nint get_lca(int x, int y)\r\n{\r\n\tif (depth[x] < depth[y])\r\n\t\tswap(x, y);\r\n\t// 第一步：把较深的 x 提到和 y 同一层。\r\n\t// 从大步长往小步长跳，能保证总复杂度是 O(log n)。\r\n\tfor (int i = LOG; i >= 0; --i)\r\n\t\tif (depth[fa[x][i]] >= depth[y])\r\n\t\t\tx = fa[x][i];\r\n\t// 若此时已经重合，说明较浅的那个点本身就是 LCA。\r\n\tif (x == y)\r\n\t\treturn x;\r\n\t// 第二步：让 x 和 y 同时尽量往上跳，\r\n\t// 但必须保证“跳完之后它们还没相遇”，这样才能把 LCA 卡在它们正上方那一层。\r\n\tfor (int i = LOG; i >= 0; --i)\r\n\t\tif (fa[x][i] != fa[y][i])\r\n\t\t{\r\n\t\t\tx = fa[x][i];\r\n\t\t\ty = fa[y][i];\r\n\t\t}\r\n\t// 循环结束后，x 和 y 已经分别处在 LCA 的两个儿子位置，因此它们的父亲就是答案。\r\n\treturn fa[x][0];\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tint n, m, root;\r\n\tcin >> n >> m >> root;\r\n\tfor (int i = 1; i < n; ++i)\r\n\t{\r\n\t\tint u, v;\r\n\t\tcin >> u >> v;\r\n\t\t// 树是无向图，所以两边都要加。\r\n\t\tadj[u].push_back(v);\r\n\t\tadj[v].push_back(u);\r\n\t}\r\n\tdepth[0] = 0;\r\n\tdfs(root, 0);\r\n\tfor (int i = 0; i < m; ++i)\r\n\t{\r\n\t\tint u, v;\r\n\t\tcin >> u >> v;\r\n\t\tcout << get_lca(u, v) << \"\\n\";\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "图论-prim最小生成树-cpp",
      "title": "prim最小生成树",
      "fileName": "prim最小生成树.cpp",
      "relativePath": "模板库/图论/prim最小生成树.cpp",
      "originalFolders": [
        "模板库",
        "图论"
      ],
      "layers": [
        "图论",
        "最小生成树"
      ],
      "note": "面向最小生成树专题整理。",
      "difficulty": "中级",
      "scenarios": [
        "最小生成树",
        "连通图最小代价连边"
      ],
      "signals": [
        "要求最小连通代价",
        "边权排序或贪心选边"
      ],
      "risks": [
        "稠密图与稀疏图实现差异要分清",
        "重边和不连通图要单独判断"
      ],
      "keywords": [
        "图论",
        "最小生成树",
        "prim最小生成树",
        "生成树",
        "贪心扩展"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst ll INF = 0x3f3f3f3f3f3f3f3f;\r\nconst int MAXN = 5005;\r\nll g[MAXN][MAXN];\r\nll dis[MAXN];\r\nbool vis[MAXN];\r\n// Prim：每次把“距离当前生成树最近”的点加入答案。\r\nll prim(int n)\r\n{\r\n\tfill(dis, dis + n + 1, INF);\r\n\tdis[1] = 0;\r\n\tll res = 0;\r\n\tfor (int i = 0; i < n; ++i)\r\n\t{\r\n\t\tint u = -1;\r\n\t\tfor (int j = 1; j <= n; ++j)\r\n\t\t\tif (!vis[j] && (u == -1 || dis[j] < dis[u]))\r\n\t\t\t\tu = j;\r\n\t\tif (dis[u] == INF)\r\n\t\t\treturn -1;\r\n\t\tvis[u] = true;\r\n\t\tres += dis[u];\r\n\t\tfor (int j = 1; j <= n; ++j)\r\n\t\t\tif (!vis[j] && g[u][j] < dis[j])\r\n\t\t\t\tdis[j] = g[u][j];\r\n\t}\r\n\treturn res;\r\n}\r\nint main()\r\n{\r\n\tint n, m;\r\n\tcin >> n >> m;\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t\tfor (int j = 1; j <= n; ++j)\r\n\t\t\tg[i][j] = INF;\r\n\tfor (int i = 0; i < m; ++i)\r\n\t{\r\n\t\tint u, v, w;\r\n\t\tcin >> u >> v >> w;\r\n\t\t// 最小生成树处理的是无向图，重边时保留较小边权。\r\n\t\tg[u][v] = min(g[u][v], (ll)w);\r\n\t\tg[v][u] = min(g[v][u], (ll)w);\r\n\t}\r\n\tcout << prim(n);\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-背包问题-01背包-cpp",
      "title": "01背包",
      "fileName": "01背包.cpp",
      "relativePath": "模板库/dp/背包问题/01背包.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "背包问题"
      ],
      "layers": [
        "动态规划",
        "背包问题"
      ],
      "note": "按 0/1、完全、多重、分组、依赖等典型模型分类。",
      "difficulty": "中级",
      "scenarios": [
        "容量限制选择",
        "价值最大化或方案计数"
      ],
      "signals": [
        "有限资源约束",
        "每个物品有体积与价值"
      ],
      "risks": [
        "循环方向错会导致模型变化",
        "状态定义不清会让转移失真"
      ],
      "keywords": [
        "动态规划",
        "背包问题",
        "01背包",
        "容量",
        "状态转移"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\n\r\n/*\r\n\t0/1 背包模板。\r\n\r\n\t状态定义：\r\n\tdp[j] 表示容量不超过 j 时，能够获得的最大价值。\r\n\r\n\t转移：\r\n\t对于每件物品 i，尝试把它放入容量 j：\r\n\tdp[j] = max(dp[j], dp[j - weight[i]] + value[i])\r\n\r\n\t为什么容量倒序：\r\n\t因为每件物品最多只能选一次。\r\n\t倒序能保证本轮更新 dp[j] 时，dp[j - weight[i]] 仍然是“上一轮”的值。\r\n*/\r\n\r\nint pack01(int W, int N, const vector<int> &weights, const vector<int> &values)\r\n{\r\n\tvector<int> dp(W + 1, 0);\r\n\tfor (int i = 0; i < N; ++i)\r\n\t\t// 倒序枚举容量，避免同一件物品被重复使用。\r\n\t\tfor (int j = W; j >= weights[i]; --j)\r\n\t\t\tdp[j] = max(dp[j], dp[j - weights[i]] + values[i]);\r\n\treturn dp[W];\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tint w, n;\r\n\tcin >> n >> w;\r\n\tvector<int> wt(n), val(n);\r\n\tfor (int i = 0; i < n; ++i)\r\n\t\tcin >> wt[i] >> val[i];\r\n\tcout << pack01(w, n, wt, val);\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-背包问题-多重背包-cpp",
      "title": "多重背包",
      "fileName": "多重背包.cpp",
      "relativePath": "模板库/dp/背包问题/多重背包.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "背包问题"
      ],
      "layers": [
        "动态规划",
        "背包问题"
      ],
      "note": "按 0/1、完全、多重、分组、依赖等典型模型分类。",
      "difficulty": "中级",
      "scenarios": [
        "容量限制选择",
        "价值最大化或方案计数"
      ],
      "signals": [
        "有限资源约束",
        "每个物品有体积与价值"
      ],
      "risks": [
        "循环方向错会导致模型变化",
        "状态定义不清会让转移失真"
      ],
      "keywords": [
        "动态规划",
        "背包问题",
        "多重背包",
        "容量",
        "状态转移"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\n\r\n/*\r\n\t多重背包模板。\r\n\r\n\t模型：每种物品有固定件数 num，不能无限拿。\r\n\r\n\t朴素做法要枚举“当前物品拿几件”，复杂度较高。\r\n\t这里使用二进制拆分：\r\n\tnum = 1 + 2 + 4 + ... + 剩余量\r\n\r\n\t拆分后，每一块都看成一件新的 0/1 物品，\r\n\t总物品数从 O(num) 降到 O(log num)。\r\n*/\r\n\r\nvoid multipack()\r\n{\r\n\tint N, W;\r\n\tcin >> N >> W;\r\n\tvector<int> dp(W + 1, 0);\r\n\tfor (int i = 0; i < N; ++i)\r\n\t{\r\n\t\tint v, w, num;\r\n\t\tcin >> v >> w >> num;\r\n\r\n\t\t// 用二进制块依次拆分件数。\r\n\t\tfor (int k = 1; num > 0; k <<= 1)\r\n\t\t{\r\n\t\t\tint take = min(k, num);\r\n\t\t\tint now_v = take * v;\r\n\t\t\tint now_w = take * w;\r\n\r\n\t\t\t// 拆完后的每一块都只允许选一次，因此仍然按 0/1 背包倒序更新。\r\n\t\t\tfor (int j = W; j >= now_w; --j)\r\n\t\t\t\tdp[j] = max(dp[j], dp[j - now_w] + now_v);\r\n\t\t\tnum -= take;\r\n\t\t}\r\n\t}\r\n\tcout << dp[W];\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tmultipack();\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-背包问题-二维01-cpp",
      "title": "二维01",
      "fileName": "二维01.cpp",
      "relativePath": "模板库/dp/背包问题/二维01.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "背包问题"
      ],
      "layers": [
        "动态规划",
        "背包问题"
      ],
      "note": "按 0/1、完全、多重、分组、依赖等典型模型分类。",
      "difficulty": "中级",
      "scenarios": [
        "容量限制选择",
        "价值最大化或方案计数"
      ],
      "signals": [
        "有限资源约束",
        "每个物品有体积与价值"
      ],
      "risks": [
        "循环方向错会导致模型变化",
        "状态定义不清会让转移失真"
      ],
      "keywords": [
        "动态规划",
        "背包问题",
        "二维01",
        "容量",
        "状态转移"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\n\r\n/*\r\n\t二维 0/1 背包模板。\r\n\r\n\t每件物品同时消耗两种资源：\r\n\t1. 容量 weights[i]\r\n\t2. 时间 ts[i]\r\n\r\n\t状态定义：\r\n\tdp[j][k] 表示容量不超过 j、时间不超过 k 时的最大价值。\r\n\r\n\t本质上仍然是 0/1 背包，只是费用维度从一维变成了二维。\r\n\t因此两个费用维都必须倒序枚举。\r\n*/\r\n\r\nint pack2D(int W, int T, int N, const vector<int> &weights, const vector<int> &ts, const vector<int> &values)\r\n{\r\n\tvector<vector<int>> dp(W + 1, vector<int>(T + 1, 0));\r\n\tfor (int i = 0; i < N; ++i)\r\n\t\t// 两个费用维都倒序，避免同一件物品在同一轮转移中被重复使用。\r\n\t\tfor (int j = W; j >= weights[i]; --j)\r\n\t\t\tfor (int k = T; k >= ts[i]; --k)\r\n\t\t\t\tdp[j][k] = max(dp[j][k], dp[j - weights[i]][k - ts[i]] + values[i]);\r\n\treturn dp[W][T];\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tint w, n, t;\r\n\tcin >> n >> w >> t;\r\n\tvector<int> we(n), te(n), val(n);\r\n\tfor (int i = 0; i < n; ++i)\r\n\t\tcin >> we[i] >> te[i] >> val[i];\r\n\tcout << pack2D(w, t, n, we, te, val);\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-背包问题-分组背包-cpp",
      "title": "分组背包",
      "fileName": "分组背包.cpp",
      "relativePath": "模板库/dp/背包问题/分组背包.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "背包问题"
      ],
      "layers": [
        "动态规划",
        "背包问题"
      ],
      "note": "按 0/1、完全、多重、分组、依赖等典型模型分类。",
      "difficulty": "中级",
      "scenarios": [
        "容量限制选择",
        "价值最大化或方案计数"
      ],
      "signals": [
        "有限资源约束",
        "每个物品有体积与价值"
      ],
      "risks": [
        "循环方向错会导致模型变化",
        "状态定义不清会让转移失真"
      ],
      "keywords": [
        "动态规划",
        "背包问题",
        "分组背包",
        "容量",
        "状态转移"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n\t分组背包模板。\r\n\r\n\t模型：\r\n\t每件物品属于某一组，每组最多选一件。\r\n\r\n\t转移顺序必须是：\r\n\t先枚举组，再倒序枚举容量，最后枚举组内选哪件。\r\n\r\n\t这样才能保证：\r\n\t当前组的决策只基于“前面各组已经处理完”的结果，\r\n\t不会在同一组里错误地选出多件物品。\r\n*/\r\n\r\nint main()\r\n{\r\n\tint n, m, w, v, g, g_max = -1;\r\n\tint dt[105][105][2] = {0}, l[105] = {0};\r\n\tint dp[1005] = {0};\r\n\tcin >> m >> n;\r\n\t// dt[g][k] 保存第 g 组第 k 件物品的体积和价值。\r\n\tfor (int i = 1; i <= n; i++)\r\n\t{\r\n\t\tcin >> w >> v >> g;\r\n\t\tdt[g][l[g]][0] = w;\r\n\t\tdt[g][l[g]++][1] = v;\r\n\t\tg_max = g > g_max ? g : g_max;\r\n\t}\r\n\tfor (int i = 1; i <= g_max; i++)\r\n\t\tfor (int j = m; j >= 0; j--)\r\n\t\t\t// 每组最多选一件，所以容量仍要倒序，避免同组内多次使用更新后的状态。\r\n\t\t\tfor (int k = 0; k < l[i]; k++)\r\n\t\t\t\tif (j >= dt[i][k][0])\r\n\t\t\t\t\tdp[j] = max(dp[j], dp[j - dt[i][k][0]] + dt[i][k][1]);\r\n\tcout << dp[m] << endl;\r\n\treturn 0;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-背包问题-完全背包-cpp",
      "title": "完全背包",
      "fileName": "完全背包.cpp",
      "relativePath": "模板库/dp/背包问题/完全背包.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "背包问题"
      ],
      "layers": [
        "动态规划",
        "背包问题"
      ],
      "note": "按 0/1、完全、多重、分组、依赖等典型模型分类。",
      "difficulty": "中级",
      "scenarios": [
        "容量限制选择",
        "价值最大化或方案计数"
      ],
      "signals": [
        "有限资源约束",
        "每个物品有体积与价值"
      ],
      "risks": [
        "循环方向错会导致模型变化",
        "状态定义不清会让转移失真"
      ],
      "keywords": [
        "动态规划",
        "背包问题",
        "完全背包",
        "容量",
        "状态转移"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\n\r\n/*\r\n  完全背包模板。\r\n\r\n  与 0/1 背包的唯一区别在于：\r\n  每件物品可以选无限次。\r\n\r\n  因此转移时需要正序枚举容量，\r\n  让当前物品在同一轮中可以继续基于“已经选过当前物品”的状态再选一次。\r\n*/\r\n\r\nint compack(int W, int N, const vector<int> &weights, const vector<int> &values)\r\n{\r\n\tvector<int> dp(W + 1, 0);\r\n\tfor (int i = 0; i < N; ++i)\r\n\t\t// 正序枚举容量，使当前物品可以被重复选取。\r\n\t\tfor (int j = weights[i]; j <= W; ++j)\r\n\t\t\tdp[j] = max(dp[j], dp[j - weights[i]] + values[i]);\r\n\treturn dp[W];\r\n}\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tint w, n;\r\n\tcin >> n >> w;\r\n\tvector<int> wt(n), val(n);\r\n\tfor (int i = 0; i < n; ++i)\r\n\t\tcin >> wt[i] >> val[i];\r\n\tcout << compack(w, n, wt, val);\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-背包问题-依赖背包-cpp",
      "title": "依赖背包",
      "fileName": "依赖背包.cpp",
      "relativePath": "模板库/dp/背包问题/依赖背包.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "背包问题"
      ],
      "layers": [
        "动态规划",
        "背包问题"
      ],
      "note": "按 0/1、完全、多重、分组、依赖等典型模型分类。",
      "difficulty": "中级",
      "scenarios": [
        "容量限制选择",
        "价值最大化或方案计数"
      ],
      "signals": [
        "有限资源约束",
        "每个物品有体积与价值"
      ],
      "risks": [
        "循环方向错会导致模型变化",
        "状态定义不清会让转移失真"
      ],
      "keywords": [
        "动态规划",
        "背包问题",
        "依赖背包",
        "容量",
        "状态转移"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nclass Item\r\n{\r\npublic:\r\n\tint w, v, r;\r\n};\r\n\r\n/*\r\n\t主件 - 附件型依赖背包。\r\n\r\n\t约束：\r\n\t附件不能单独购买，必须和自己的主件一起买。\r\n\r\n\t处理套路：\r\n\t先按主件把所有“合法购买组合”列出来，\r\n\t然后把每个主件对应的若干种合法方案，当作一次分组背包转移。\r\n\r\n\t这个模板假设每个主件最多带两个附件，\r\n\t因此每个主件只需要枚举 4 种合法选择：\r\n\t1. 只买主件\r\n\t2. 主件 + 附件 1\r\n\t3. 主件 + 附件 2\r\n\t4. 主件 + 两个附件都买\r\n*/\r\n\r\nint main()\r\n{\r\n\tint m, n;\r\n\tcin >> n >> m;\r\n\tvector<Item> item(m + 1);\r\n\tvector<int> mit;\r\n\tvector<int> dp(n + 1, 0);\r\n\tfor (int i = 1; i <= m; i++)\r\n\t{\r\n\t\tcin >> item[i].w >> item[i].v >> item[i].r;\r\n\t\t// 这里把“价格 * 重要度”直接折算成收益。\r\n\t\titem[i].v *= item[i].w;\r\n\t\tif (item[i].r == 0)\r\n\t\t\tmit.emplace_back(i);\r\n\t}\r\n\r\n\t// 对每个主件，把所有合法搭配都展开后做 0/1 背包。\r\n\tfor (int i = 0; i < mit.size(); i++)\r\n\t{\r\n\t\tint w0 = item[mit[i]].w, v0 = item[mit[i]].v;\r\n\t\tint v1, w1, v2, w2;\r\n\t\tv1 = v2 = w1 = w2 = 0;\r\n\t\tfor (int j = 1; j <= m; j++)\r\n\t\t\tif (item[j].r == mit[i])\r\n\t\t\t\tif (v1 == 0 && w1 == 0)\r\n\t\t\t\t{\r\n\t\t\t\t\tv1 = item[j].v;\r\n\t\t\t\t\tw1 = item[j].w;\r\n\t\t\t\t}\r\n\t\t\t\telse\r\n\t\t\t\t{\r\n\t\t\t\t\tv2 = item[j].v;\r\n\t\t\t\t\tw2 = item[j].w;\r\n\t\t\t\t}\r\n\t\tfor (int j = n; j >= w0; j--)\r\n\t\t{\r\n\t\t\t// 方案 1：只买主件。\r\n\t\t\tif (j >= w0)\r\n\t\t\t\tdp[j] = max(dp[j], dp[j - w0] + v0);\r\n\r\n\t\t\t// 方案 2：主件 + 附件 1。\r\n\t\t\tif (j >= w0 + w1)\r\n\t\t\t\tdp[j] = max(dp[j], dp[j - w0 - w1] + v0 + v1);\r\n\r\n\t\t\t// 方案 3：主件 + 附件 2。\r\n\t\t\tif (j >= w0 + w2)\r\n\t\t\t\tdp[j] = max(dp[j], dp[j - w0 - w2] + v0 + v2);\r\n\r\n\t\t\t// 方案 4：主件 + 两个附件全买。\r\n\t\t\tif (j >= w0 + w1 + w2)\r\n\t\t\t\tdp[j] = max(dp[j], dp[j - w0 - w1 - w2] + v0 + v1 + v2);\r\n\t\t}\r\n\t}\r\n\tcout << dp[n];\r\n\treturn 0;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-倍增法应用-cpp",
      "title": "倍增法应用",
      "fileName": "倍增法应用.cpp",
      "relativePath": "模板库/dp/倍增法应用.cpp",
      "originalFolders": [
        "模板库",
        "dp"
      ],
      "layers": [
        "动态规划",
        "基础专题"
      ],
      "note": "存放 LIS、线性 DP、区间覆盖等基础 DP 模板。",
      "difficulty": "中级",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "动态规划",
        "基础专题",
        "倍增法应用"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n    合并型 DP / 倍增式区间合并模板。\r\n\r\n    状态定义：\r\n    f[x][i] 表示从位置 i 开始，是否能拼出一个“值为 x”的合法区间；\r\n    如果能，f[x][i] 记录该区间结束后的下一个位置。\r\n\r\n    这样设计的好处：\r\n    当要继续往后拼接下一段时，不需要重新找终点，直接跳到 f[x][i] 即可。\r\n\r\n    核心转移：\r\n    若从 i 开始能拼出一段值为 x-1 的区间，且紧接着还能再拼出一段值为 x-1 的区间，\r\n    那么这两段就能合并成一段值为 x 的区间。\r\n*/\r\n\r\nint f[60][270000], n, ans = 0;\r\nint main()\r\n{\r\n    cin >> n;\r\n    for (int i = 1; i <= n; ++i)\r\n    {\r\n        int num;\r\n        cin >> num;\r\n\r\n        // 初始时，每个位置本身就能作为长度为 1 的一个基础块。\r\n        f[num][i] = i + 1;\r\n    }\r\n    for (int i = 2; i <= 58; ++i)\r\n    {\r\n        for (int j = 1; j <= n; ++j)\r\n        {\r\n            // 若两段值为 i-1 的区间首尾相接，就能合并成一段值为 i 的区间。\r\n            if (!f[i][j])\r\n                f[i][j] = f[i - 1][f[i - 1][j]];\r\n            if (f[i][j])\r\n                ans = i;\r\n        }\r\n    }\r\n    cout << ans;\r\n    return 0;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-不含101字符串个数-cpp",
      "title": "不含101字符串个数",
      "fileName": "不含101字符串个数.cpp",
      "relativePath": "模板库/dp/不含101字符串个数.cpp",
      "originalFolders": [
        "模板库",
        "dp"
      ],
      "layers": [
        "动态规划",
        "基础专题"
      ],
      "note": "存放 LIS、线性 DP、区间覆盖等基础 DP 模板。",
      "difficulty": "中级",
      "scenarios": [
        "字符串处理",
        "字符序列变换"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "动态规划",
        "基础专题",
        "不含101字符串个数"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\n\r\n/*\r\n  小状态计数 DP：统计长度为 n 的二进制串中，不含子串 101 的方案数。\r\n\r\n  这类题的关键不是“长度”，而是“末尾最近几位长什么样”。\r\n  因为当你决定下一位填 0 还是 1 时，是否会形成 101，只和最后两位有关。\r\n\r\n  这里用四组状态表示长度为 i 时，末尾两位属于哪种形态。\r\n  虽然变量名较简略，但本质就是在维护一个 4 状态自动机。\r\n*/\r\n\r\nint main()\r\n{\r\n\t// tt / tf / ft / ff 分别表示当前长度下，末尾两位的四种状态计数。\r\n\tint tt[25], tf[25], ft[25], ff[25], a[25];\r\n\ta[1] = 2;\r\n\ta[2] = 4;\r\n\t// 长度为 2 时，四种末尾状态各出现 1 次：11、10、01、00。\r\n\ttt[2] = tf[2] = ft[2] = ff[2] = 1;\r\n\r\n\t// 按照“末尾补 0 或 1 后会转移到哪一种末尾形态”进行递推。\r\n\t// a[i] 记录长度为 i 的总合法方案数。\r\n\tfor (int i = 3; i <= 20; ++i)\r\n\t{\r\n\t\t// 新串末尾想变成 11，上一位必须先是 1，再补一个 1；\r\n\t\t// 所以前一状态只能来自 11 或 10。\r\n\t\ttt[i] = tt[i - 1] + tf[i - 1];\r\n\t\t// 新串末尾想变成 10，前一位必须先是 0，再补一个 1；\r\n\t\t// 又因为不能出现 101，所以前一状态只能从 00 转来，不能从 01 转来。\r\n\t\ttf[i] = ff[i - 1];\r\n\t\t// 新串末尾想变成 01，说明上一位是 1、当前位补 0；\r\n\t\t// 前一状态可以是 11 或 10。\r\n\t\tft[i] = tt[i - 1] + tf[i - 1];\r\n\t\t// 新串末尾想变成 00，说明上一位是 0、当前位也补 0；\r\n\t\t// 前一状态可以是 01 或 00。\r\n\t\tff[i] = ft[i - 1] + ff[i - 1];\r\n\t\t// 总方案数就是四种合法末尾状态的总和。\r\n\t\ta[i] = tt[i] + tf[i] + ft[i] + ff[i];\r\n\t}\r\n\tint n;\r\n\twhile (true)\r\n\t{\r\n\t\tcin >> n;\r\n\t\tif (n == -1)\r\n\t\t\tbreak;\r\n\t\tcout << a[n] << \"\\n\";\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-单调队列优化线性dp-cpp",
      "title": "单调队列优化线性dp",
      "fileName": "单调队列优化线性dp.cpp",
      "relativePath": "模板库/dp/单调队列优化线性dp.cpp",
      "originalFolders": [
        "模板库",
        "dp"
      ],
      "layers": [
        "动态规划",
        "基础专题"
      ],
      "note": "存放 LIS、线性 DP、区间覆盖等基础 DP 模板。",
      "difficulty": "中级",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "动态规划",
        "基础专题",
        "单调队列优化线性dp"
      ],
      "code": "#include <iostream>\r\n#include <vector>\r\n#include <deque>\r\n#include <algorithm>\r\n\r\nusing namespace std;\r\n\r\n/*\r\n    单调队列优化线性 DP。\r\n\r\n    模型特征：\r\n    dp[i] 需要从某个滑动窗口 [i-r, i-l] 内的最优 dp[j] 转移而来。\r\n\r\n    若朴素枚举前驱，复杂度通常是 O(n(r-l+1))。\r\n    由于每次只需要窗口中的最大值，因此可以用单调队列把复杂度降到 O(n)。\r\n\r\n    队列里存的是下标，不是值。\r\n    这样既能比较 dp 值大小，也能判断下标是否已经滑出窗口。\r\n*/\r\n\r\n// 定义一个安全的极小值，既能代表\"不可达\"，又防止加上负数得分时引发 int 溢出。\r\nconst int INF = 1e9;\r\n\r\nint main()\r\n{\r\n    // 基础的输入输出加速\r\n    ios_base::sync_with_stdio(false);\r\n    cin.tie(nullptr);\r\n\r\n    int n, l, r;\r\n    if (!(cin >> n >> l >> r))\r\n        return 0;\r\n\r\n    vector<int> a(n + 1);\r\n    for (int i = 0; i <= n; ++i)\r\n    {\r\n        cin >> a[i];\r\n    }\r\n\r\n    // dp[i] 表示跳到第 i 个格子时能获得的最大分数\r\n    // 初始化为 -INF 代表该位置暂时不可达\r\n    vector<int> dp(n + 1, -INF);\r\n    dp[0] = a[0]; // 起点分数\r\n\r\n    deque<int> q; // 单调队列，里面维护的是当前窗口内可能成为最优前驱的下标。\r\n\r\n    // 核心 DP 状态转移\r\n    for (int i = l; i <= n; ++i)\r\n    {\r\n        int enter_idx = i - l; // 当前即将进入滑动窗口的下标\r\n\r\n        // 1. 维护队列里的 dp 值单调递减。\r\n        // 新进入的状态若更优，则队尾那些更差的状态以后都不会再被用到。\r\n        while (!q.empty() && dp[q.back()] <= dp[enter_idx])\r\n        {\r\n            q.pop_back();\r\n        }\r\n        q.push_back(enter_idx); // 将新下标入队\r\n\r\n        // 2. 剔除已经滑出合法窗口的下标。\r\n        while (!q.empty() && q.front() < i - r)\r\n        {\r\n            q.pop_front();\r\n        }\r\n\r\n        // 3. 队头就是当前窗口内 dp 最大的可用前驱。\r\n        if (!q.empty() && dp[q.front()] != -INF)\r\n        {\r\n            dp[i] = a[i] + dp[q.front()];\r\n        }\r\n    }\r\n\r\n    // 4. 统计最终答案\r\n    // 只要处于能一步跳出终点 (即越过 n) 的位置，就是合法的结局位置。\r\n    // 能跳过 n 的合法起点范围是 [n - r + 1, n]\r\n    int ans = -INF;\r\n    for (int i = n - r + 1; i <= n; ++i)\r\n    {\r\n        if (i >= 0)\r\n        { // 防止跳跃距离极大导致下标出现负数\r\n            ans = max(ans, dp[i]);\r\n        }\r\n    }\r\n\r\n    cout << ans << \"\\n\";\r\n\r\n    return 0;\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-进阶-概率期望dp-cpp",
      "title": "概率期望dp",
      "fileName": "概率期望dp.cpp",
      "relativePath": "模板库/dp/进阶/概率期望dp.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "进阶"
      ],
      "layers": [
        "动态规划",
        "进阶专题"
      ],
      "note": "包含数位 DP、状压 DP、树形 DP 等进阶模型。",
      "difficulty": "进阶",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "动态规划",
        "进阶专题",
        "概率期望dp"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n  概率 / 期望 DP 基础模板：DAG 上的期望路径长度。\r\n\r\n  模型：\r\n  从点 1 出发，每次在当前点的所有出边中等概率随机选一条走。\r\n  给定一张 DAG，边带权，求从 1 走到终点的期望路径长度。\r\n\r\n  状态定义：\r\n  E[u] 表示从 u 出发到达终止状态的期望代价。\r\n\r\n  转移：\r\n  若 u 有 outdeg[u] 条出边，则\r\n  E[u] = sum(E[v] + w(u,v)) / outdeg[u]\r\n\r\n  因为是 DAG，所以可以先拓扑排序，再逆拓扑序递推期望。\r\n*/\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\tint n, m;\r\n\tcin >> n >> m;\r\n\r\n\tvector<vector<pair<int, int>>> g(n + 1);\r\n\tvector<int> indeg(n + 1, 0), outdeg(n + 1, 0);\r\n\r\n\tfor (int i = 0; i < m; ++i)\r\n\t{\r\n\t\tint u, v, w;\r\n\t\tcin >> u >> v >> w;\r\n\t\tg[u].push_back({v, w});\r\n\t\t++indeg[v];\r\n\t\t++outdeg[u];\r\n\t}\r\n\r\n\tqueue<int> q;\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t\tif (indeg[i] == 0)\r\n\t\t\tq.push(i);\r\n\r\n\tvector<int> topo;\r\n\twhile (!q.empty())\r\n\t{\r\n\t\tint u = q.front();\r\n\t\tq.pop();\r\n\t\ttopo.push_back(u);\r\n\t\tfor (auto [v, w] : g[u])\r\n\t\t{\r\n\t\t\tif (--indeg[v] == 0)\r\n\t\t\t\tq.push(v);\r\n\t\t}\r\n\t}\r\n\r\n\tvector<double> expect(n + 1, 0.0);\r\n\tfor (int idx = (int)topo.size() - 1; idx >= 0; --idx)\r\n\t{\r\n\t\tint u = topo[idx];\r\n\t\tif (outdeg[u] == 0)\r\n\t\t\tcontinue;\r\n\t\tdouble sum = 0.0;\r\n\t\tfor (auto [v, w] : g[u])\r\n\t\t\tsum += expect[v] + w;\r\n\t\texpect[u] = sum / outdeg[u];\r\n\t}\r\n\r\n\tcout << fixed << setprecision(10) << expect[1] << '\\n';\r\n\treturn 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-进阶-换根dp-cpp",
      "title": "换根dp",
      "fileName": "换根dp.cpp",
      "relativePath": "模板库/dp/进阶/换根dp.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "进阶"
      ],
      "layers": [
        "动态规划",
        "进阶专题"
      ],
      "note": "包含数位 DP、状压 DP、树形 DP 等进阶模型。",
      "difficulty": "进阶",
      "scenarios": [
        "树上状态转移",
        "以节点关系定义状态"
      ],
      "signals": [
        "输入是一棵树",
        "答案依赖父子关系"
      ],
      "risks": [
        "递归顺序影响转移正确性",
        "子树合并复杂度容易爆炸"
      ],
      "keywords": [
        "动态规划",
        "进阶专题",
        "换根dp"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n  换根 DP 基础模板：求每个点作为根时，到所有点的距离和。\r\n\r\n  第一遍 DFS：\r\n  sz[u]   = u 子树大小\r\n  down[u] = 以 1 为根时，u 子树内所有点到 u 的距离和\r\n\r\n  第二遍 DFS：\r\n  ans[u] 表示以 u 为根时，到全树所有点的距离和。\r\n\r\n  当根从 u 换到儿子 v 时：\r\n  ans[v] = ans[u] + (n - 2 * sz[v])\r\n\r\n  理解：\r\n  1. v 子树里的 sz[v] 个点离新根更近 1\r\n  2. 其余 n - sz[v] 个点离新根更远 1\r\n*/\r\n\r\nconst int N = 200005;\r\n\r\nint n;\r\nvector<int> g[N];\r\nint sz[N];\r\nlong long down_sum[N], ans[N];\r\n\r\nvoid dfs1(int u, int parent)\r\n{\r\n\tsz[u] = 1;\r\n\tdown_sum[u] = 0;\r\n\tfor (int v : g[u])\r\n\t{\r\n\t\tif (v == parent)\r\n\t\t\tcontinue;\r\n\t\tdfs1(v, u);\r\n\t\tsz[u] += sz[v];\r\n\t\tdown_sum[u] += down_sum[v] + sz[v];\r\n\t}\r\n}\r\n\r\nvoid dfs2(int u, int parent)\r\n{\r\n\tfor (int v : g[u])\r\n\t{\r\n\t\tif (v == parent)\r\n\t\t\tcontinue;\r\n\t\tans[v] = ans[u] + (n - 2LL * sz[v]);\r\n\t\tdfs2(v, u);\r\n\t}\r\n}\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\tcin >> n;\r\n\tfor (int i = 1; i < n; ++i)\r\n\t{\r\n\t\tint u, v;\r\n\t\tcin >> u >> v;\r\n\t\tg[u].push_back(v);\r\n\t\tg[v].push_back(u);\r\n\t}\r\n\r\n\tdfs1(1, 0);\r\n\tans[1] = down_sum[1];\r\n\tdfs2(1, 0);\r\n\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t\tcout << ans[i] << (i == n ? '\\n' : ' ');\r\n\treturn 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-进阶-轮廓线dp-cpp",
      "title": "轮廓线dp",
      "fileName": "轮廓线dp.cpp",
      "relativePath": "模板库/dp/进阶/轮廓线dp.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "进阶"
      ],
      "layers": [
        "动态规划",
        "进阶专题"
      ],
      "note": "包含数位 DP、状压 DP、树形 DP 等进阶模型。",
      "difficulty": "进阶",
      "scenarios": [
        "棋盘覆盖",
        "二维压缩状态转移"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "状态压缩编码复杂",
        "位运算细节和状态合法性容易出错"
      ],
      "keywords": [
        "动态规划",
        "进阶专题",
        "轮廓线dp",
        "轮廓线",
        "插头"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n  轮廓线 / Broken Profile DP 基础模板：统计 n * m 空棋盘的多米诺骨牌铺法数。\r\n\r\n  状态理解：\r\n  按行推进，mask 表示“当前行中哪些格子已经被上一行伸下来的竖骨牌占用”。\r\n\r\n  对于当前行，我们从左到右 DFS：\r\n  1. 若当前位置已被占用，跳过\r\n  2. 否则尝试横放一个骨牌\r\n  3. 或尝试竖放一个骨牌，把占用信息留给下一行的 next_mask\r\n\r\n  这类模板的重点不在题目本身，而在“用一条轮廓线状态描述行与行之间的衔接”。\r\n*/\r\n\r\nint n, m;\r\nvector<long long> dp, next_dp;\r\n\r\nvoid dfs_fill_row(int col, int cur_mask, int next_mask, long long ways)\r\n{\r\n\tif (col == m)\r\n\t{\r\n\t\tnext_dp[next_mask] += ways;\r\n\t\treturn;\r\n\t}\r\n\r\n\tif (cur_mask & (1 << col))\r\n\t{\r\n\t\tdfs_fill_row(col + 1, cur_mask, next_mask, ways);\r\n\t\treturn;\r\n\t}\r\n\r\n\t// 横放：占用当前格和右边一格。\r\n\tif (col + 1 < m && !(cur_mask & (1 << (col + 1))))\r\n\t\tdfs_fill_row(col + 2, cur_mask, next_mask, ways);\r\n\r\n\t// 竖放：当前格占到下一行，因此记录到 next_mask。\r\n\tdfs_fill_row(col + 1, cur_mask, next_mask | (1 << col), ways);\r\n}\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\tcin >> n >> m;\r\n\tif (n < m)\r\n\t\tswap(n, m);\r\n\r\n\tint states = 1 << m;\r\n\tdp.assign(states, 0);\r\n\tdp[0] = 1;\r\n\r\n\tfor (int row = 0; row < n; ++row)\r\n\t{\r\n\t\tnext_dp.assign(states, 0);\r\n\t\tfor (int mask = 0; mask < states; ++mask)\r\n\t\t{\r\n\t\t\tif (dp[mask] == 0)\r\n\t\t\t\tcontinue;\r\n\t\t\tdfs_fill_row(0, mask, 0, dp[mask]);\r\n\t\t}\r\n\t\tdp.swap(next_dp);\r\n\t}\r\n\r\n\tcout << dp[0] << '\\n';\r\n\treturn 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-进阶-区间dp-cpp",
      "title": "区间dp",
      "fileName": "区间dp.cpp",
      "relativePath": "模板库/dp/进阶/区间dp.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "进阶"
      ],
      "layers": [
        "动态规划",
        "进阶专题"
      ],
      "note": "包含数位 DP、状压 DP、树形 DP 等进阶模型。",
      "difficulty": "进阶",
      "scenarios": [
        "区间合并",
        "子区间递推"
      ],
      "signals": [
        "答案由子区间合并",
        "区间长度递增转移"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "动态规划",
        "进阶专题",
        "区间dp"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n  区间 DP 基础模板：石子合并。\r\n\r\n  模型：\r\n  每次合并一段连续区间的两部分，代价为这一整段石子的总和。\r\n  求把整个区间合并成一堆的最小代价。\r\n\r\n  状态定义：\r\n  dp[l][r] 表示把区间 [l, r] 合并成一堆的最小代价。\r\n\r\n  转移：\r\n  枚举最后一次合并的位置 k：\r\n  dp[l][r] = min(dp[l][k] + dp[k+1][r] + sum(l, r))\r\n\r\n  循环顺序：\r\n  必须按区间长度从小到大递推。\r\n*/\r\n\r\nconst int N = 305;\r\nconst long long INF = (1LL << 60);\r\n\r\nint n;\r\nlong long a[N], prefix[N], dp[N][N];\r\n\r\nlong long range_sum(int l, int r)\r\n{\r\n\treturn prefix[r] - prefix[l - 1];\r\n}\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\tcin >> n;\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t{\r\n\t\tcin >> a[i];\r\n\t\tprefix[i] = prefix[i - 1] + a[i];\r\n\t}\r\n\r\n\tfor (int len = 2; len <= n; ++len)\r\n\t{\r\n\t\tfor (int l = 1; l + len - 1 <= n; ++l)\r\n\t\t{\r\n\t\t\tint r = l + len - 1;\r\n\t\t\tdp[l][r] = INF;\r\n\t\t\tfor (int k = l; k < r; ++k)\r\n\t\t\t{\r\n\t\t\t\tdp[l][r] = min(dp[l][r], dp[l][k] + dp[k + 1][r] + range_sum(l, r));\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\r\n\tcout << dp[1][n] << '\\n';\r\n\treturn 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-进阶-树上背包-cpp",
      "title": "树上背包",
      "fileName": "树上背包.cpp",
      "relativePath": "模板库/dp/进阶/树上背包.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "进阶"
      ],
      "layers": [
        "动态规划",
        "进阶专题"
      ],
      "note": "包含数位 DP、状压 DP、树形 DP 等进阶模型。",
      "difficulty": "进阶",
      "scenarios": [
        "容量限制选择",
        "价值最大化或方案计数"
      ],
      "signals": [
        "输入是一棵树",
        "答案依赖父子关系"
      ],
      "risks": [
        "循环方向错会导致模型变化",
        "状态定义不清会让转移失真"
      ],
      "keywords": [
        "动态规划",
        "进阶专题",
        "树上背包",
        "容量",
        "状态转移"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n  树上背包基础模板：有依赖关系的选点。\r\n\r\n  模型：\r\n  每个点有一个收益，若要选一个点，必须先选它的父亲。\r\n  求恰好选 m 个真实点时的最大收益。\r\n\r\n  这是 P2014 选课 的标准骨架：\r\n  1. 建一个虚根 0\r\n  2. 所有没有父亲的点都连到 0\r\n  3. dp[u][k] 表示在 u 的子树里，选 k 个点且必须选 u 时的最大收益\r\n\r\n  由于虚根 0 不算真实点，最后答案取 dp[0][m+1]。\r\n*/\r\n\r\nconst int N = 305;\r\nconst int NEG_INF = -1e9;\r\n\r\nint n, m;\r\nint val[N];\r\nint sz[N];\r\nvector<int> g[N];\r\nint dp[N][N];\r\n\r\nvoid dfs(int u)\r\n{\r\n\tsz[u] = 1;\r\n\tfor (int i = 0; i <= m + 1; ++i)\r\n\t\tdp[u][i] = NEG_INF;\r\n\tdp[u][1] = val[u];\r\n\r\n\tfor (int v : g[u])\r\n\t{\r\n\t\tdfs(v);\r\n\t\tfor (int i = min(sz[u], m + 1); i >= 1; --i)\r\n\t\t{\r\n\t\t\tfor (int j = 1; j <= min(sz[v], m + 1 - i); ++j)\r\n\t\t\t{\r\n\t\t\t\tdp[u][i + j] = max(dp[u][i + j], dp[u][i] + dp[v][j]);\r\n\t\t\t}\r\n\t\t}\r\n\t\tsz[u] += sz[v];\r\n\t}\r\n}\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\tcin >> n >> m;\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t{\r\n\t\tint parent;\r\n\t\tcin >> parent >> val[i];\r\n\t\tg[parent].push_back(i);\r\n\t}\r\n\r\n\tval[0] = 0;\r\n\tdfs(0);\r\n\tcout << dp[0][m + 1] << '\\n';\r\n\treturn 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-进阶-树形dp-cpp",
      "title": "树形dp",
      "fileName": "树形dp.cpp",
      "relativePath": "模板库/dp/进阶/树形dp.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "进阶"
      ],
      "layers": [
        "动态规划",
        "进阶专题"
      ],
      "note": "包含数位 DP、状压 DP、树形 DP 等进阶模型。",
      "difficulty": "进阶",
      "scenarios": [
        "树上状态转移",
        "以节点关系定义状态"
      ],
      "signals": [
        "输入是一棵树",
        "答案依赖父子关系"
      ],
      "risks": [
        "递归顺序影响转移正确性",
        "子树合并复杂度容易爆炸"
      ],
      "keywords": [
        "动态规划",
        "进阶专题",
        "树形dp"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n  树形 DP 基础模板：点权树上最大独立集。\r\n\r\n  模型：\r\n  每个点有点权，选一个点后，它的相邻点都不能选。\r\n  求能选出的最大总权值。\r\n\r\n  状态定义：\r\n  dp[u][0] 表示 u 不选时，u 子树内的最大权值和。\r\n  dp[u][1] 表示 u 选时，u 子树内的最大权值和。\r\n\r\n  转移：\r\n  1. 若不选 u，则每个儿子可选可不选：\r\n\t dp[u][0] += max(dp[v][0], dp[v][1])\r\n  2. 若选 u，则儿子都不能选：\r\n\t dp[u][1] += dp[v][0]\r\n*/\r\n\r\nconst int N = 100005;\r\n\r\nint n;\r\nint w[N];\r\nvector<int> g[N];\r\nlong long dp[N][2];\r\n\r\nvoid dfs(int u, int parent)\r\n{\r\n\tdp[u][0] = 0;\r\n\tdp[u][1] = w[u];\r\n\r\n\tfor (int v : g[u])\r\n\t{\r\n\t\tif (v == parent)\r\n\t\t\tcontinue;\r\n\t\tdfs(v, u);\r\n\t\tdp[u][0] += max(dp[v][0], dp[v][1]);\r\n\t\tdp[u][1] += dp[v][0];\r\n\t}\r\n}\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\tcin >> n;\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t\tcin >> w[i];\r\n\r\n\tfor (int i = 1; i < n; ++i)\r\n\t{\r\n\t\tint u, v;\r\n\t\tcin >> u >> v;\r\n\t\tg[u].push_back(v);\r\n\t\tg[v].push_back(u);\r\n\t}\r\n\r\n\tdfs(1, 0);\r\n\tcout << max(dp[1][0], dp[1][1]) << '\\n';\r\n\treturn 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-进阶-数位dp-cpp",
      "title": "数位dp",
      "fileName": "数位dp.cpp",
      "relativePath": "模板库/dp/进阶/数位dp.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "进阶"
      ],
      "layers": [
        "动态规划",
        "进阶专题"
      ],
      "note": "包含数位 DP、状压 DP、树形 DP 等进阶模型。",
      "difficulty": "进阶",
      "scenarios": [
        "数位限制统计",
        "按位构造计数"
      ],
      "signals": [
        "统计某范围内数字",
        "条件落在每一位上"
      ],
      "risks": [
        "前导零与上界限制容易漏掉",
        "记忆化状态设计复杂"
      ],
      "keywords": [
        "动态规划",
        "进阶专题",
        "数位dp",
        "记忆化",
        "按位统计"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n  数位 DP 基础模板：统计 [0, n] 中不含数字 4 且不含连续子串 62 的数有多少个。\r\n\r\n  这个模板的重点不在题意，而在骨架：\r\n  1. 把数字拆成数位数组\r\n  2. 写 dfs(pos, prev, tight, started)\r\n  3. tight 为假时记忆化\r\n\r\n  started 表示前面是否已经放过非前导零数字。\r\n  若还没开始，就不应把前导零错误地计入限制状态。\r\n*/\r\n\r\nlong long memo[20][10][2];\r\nbool vis[20][10][2];\r\nvector<int> digits;\r\n\r\nlong long dfs(int pos, int prev_digit, bool tight, bool started)\r\n{\r\n\t// 所有数位都处理完后，说明当前构造是一种合法方案。\r\n\tif (pos == -1)\r\n\t\treturn 1;\r\n\r\n\t// 只有在“不受上界限制”时，这个状态未来的转移才完全固定，可以安全记忆化。\r\n\tif (!tight && vis[pos][prev_digit][started])\r\n\t\treturn memo[pos][prev_digit][started];\r\n\r\n\t// tight=true 时，这一位最多填到原数字对应位；否则可以自由填 0..9。\r\n\tint up = tight ? digits[pos] : 9;\r\n\tlong long ans = 0;\r\n\r\n\tfor (int d = 0; d <= up; ++d)\r\n\t{\r\n\t\t// 一旦填入非 0，就说明后续已经正式进入数字本体，不再是前导零阶段。\r\n\t\tbool next_started = started || (d != 0);\r\n\r\n\t\tif (next_started)\r\n\t\t{\r\n\t\t\t// 限制 1：数字里不能出现 4。\r\n\t\t\tif (d == 4)\r\n\t\t\t\tcontinue;\r\n\t\t\t// 限制 2：已经开始构造后，不能让“上一位是 6、当前位是 2”连在一起。\r\n\t\t\tif (started && prev_digit == 6 && d == 2)\r\n\t\t\t\tcontinue;\r\n\t\t}\r\n\r\n\t\t// 若还没开始，prev_digit 没有真实含义，统一置 0 占位即可；\r\n\t\t// 若已经开始，就把当前位 d 作为下一层的“上一位”。\r\n\t\tint next_prev = next_started ? d : 0;\r\n\t\t// tight 只有在“当前位也贴着上界去填”时才会继续保持为真。\r\n\t\tans += dfs(pos - 1, next_prev, tight && (d == up), next_started);\r\n\t}\r\n\r\n\tif (!tight)\r\n\t{\r\n\t\t// 记下这个自由状态，下次再遇到同样的 pos/prev/started 组合就能直接复用。\r\n\t\tvis[pos][prev_digit][started] = true;\r\n\t\tmemo[pos][prev_digit][started] = ans;\r\n\t}\r\n\treturn ans;\r\n}\r\n\r\nlong long solve(long long n)\r\n{\r\n\tif (n < 0)\r\n\t\treturn 0;\r\n\tdigits.clear();\r\n\t// 把数字拆成低位在前的形式，方便 dfs 按 pos 从高位往低位处理。\r\n\twhile (n > 0)\r\n\t{\r\n\t\tdigits.push_back(n % 10);\r\n\t\tn /= 10;\r\n\t}\r\n\t// n=0 时 while 不会进，需要手动补一个 0 位，保证 dfs 至少处理一位。\r\n\tif (digits.empty())\r\n\t\tdigits.push_back(0);\r\n\treturn dfs((int)digits.size() - 1, 0, true, false);\r\n}\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\tlong long l, r;\r\n\tcin >> l >> r;\r\n\tmemset(vis, 0, sizeof(vis));\r\n\tcout << solve(r) - solve(l - 1) << '\\n';\r\n\treturn 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-进阶-斜率优化dp-cpp",
      "title": "斜率优化dp",
      "fileName": "斜率优化dp.cpp",
      "relativePath": "模板库/dp/进阶/斜率优化dp.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "进阶"
      ],
      "layers": [
        "动态规划",
        "进阶专题"
      ],
      "note": "包含数位 DP、状压 DP、树形 DP 等进阶模型。",
      "difficulty": "进阶",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "动态规划",
        "进阶专题",
        "斜率优化dp"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n  斜率优化 DP 基础模板。\r\n\r\n  模型：\r\n  dp[i] = min_{0 <= j < i} { dp[j] + (s[i] - s[j] - L)^2 }\r\n\r\n  其中 s[i] 为前缀和，且查询点 s[i] 单调不降。\r\n\r\n  展开后可得：\r\n  dp[i] = s[i]^2 + min_j { [dp[j] + (s[j] + L)^2] - 2 * s[i] * (s[j] + L) }\r\n\r\n  因此每个 j 可以看成一条直线：\r\n  y = m * x + b\r\n  其中：\r\n  m = -2 * (s[j] + L)\r\n  b = dp[j] + (s[j] + L)^2\r\n\r\n  当 s[i] 单调时，可以用单调队列维护凸包。\r\n*/\r\n\r\nusing ll = long long;\r\nusing i128 = __int128_t;\r\n\r\nstruct Line\r\n{\r\n\tll m, b;\r\n};\r\n\r\nll value(const Line &line, ll x)\r\n{\r\n\treturn line.m * x + line.b;\r\n}\r\n\r\nbool bad(const Line &a, const Line &b, const Line &c)\r\n{\r\n\treturn (i128)(b.b - a.b) * (b.m - c.m) >= (i128)(c.b - b.b) * (a.m - b.m);\r\n}\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\tint n;\r\n\tll L;\r\n\tcin >> n >> L;\r\n\r\n\tvector<ll> a(n + 1), s(n + 1), dp(n + 1, 0);\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t{\r\n\t\tcin >> a[i];\r\n\t\ts[i] = s[i - 1] + a[i];\r\n\t}\r\n\r\n\tdeque<Line> q;\r\n\tauto make_line = [&](int j) -> Line\r\n\t{\r\n\t\tll xj = s[j] + L;\r\n\t\treturn {-2 * xj, dp[j] + xj * xj};\r\n\t};\r\n\r\n\tq.push_back(make_line(0));\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t{\r\n\t\twhile (q.size() >= 2 && value(q[0], s[i]) >= value(q[1], s[i]))\r\n\t\t\tq.pop_front();\r\n\r\n\t\tdp[i] = s[i] * s[i] + value(q.front(), s[i]);\r\n\r\n\t\tLine cur = make_line(i);\r\n\t\twhile (q.size() >= 2 && bad(q[q.size() - 2], q.back(), cur))\r\n\t\t\tq.pop_back();\r\n\t\tq.push_back(cur);\r\n\t}\r\n\r\n\tcout << dp[n] << '\\n';\r\n\treturn 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-进阶-状压dp-cpp",
      "title": "状压dp",
      "fileName": "状压dp.cpp",
      "relativePath": "模板库/dp/进阶/状压dp.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "进阶"
      ],
      "layers": [
        "动态规划",
        "进阶专题"
      ],
      "note": "包含数位 DP、状压 DP、树形 DP 等进阶模型。",
      "difficulty": "进阶",
      "scenarios": [
        "子集状态枚举",
        "位掩码状态转移"
      ],
      "signals": [
        "状态总数较小但可用位表示",
        "需要枚举子集"
      ],
      "risks": [
        "状态压缩编码复杂",
        "位运算细节和状态合法性容易出错"
      ],
      "keywords": [
        "动态规划",
        "进阶专题",
        "状压dp",
        "位压缩",
        "子集枚举"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n  状压 DP 基础模板：TSP 型最短 Hamilton 路。\r\n\r\n  模型：\r\n  给定 n 个点和两两距离，求从 0 号点出发，访问所有点一次的最短路径长度。\r\n\r\n  状态定义：\r\n  dp[mask][i] 表示已经访问的点集为 mask，且当前停在 i 时的最短路。\r\n\r\n  转移：\r\n  枚举下一个未访问点 j：\r\n  dp[mask | (1 << j)][j] = min(dp[mask | (1 << j)][j], dp[mask][i] + dist[i][j])\r\n*/\r\n\r\nconst long long INF = (1LL << 60);\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\tint n;\r\n\tcin >> n;\r\n\tvector<vector<long long>> dist(n, vector<long long>(n));\r\n\tfor (int i = 0; i < n; ++i)\r\n\t\tfor (int j = 0; j < n; ++j)\r\n\t\t\tcin >> dist[i][j];\r\n\r\n\tint full = 1 << n;\r\n\tvector<vector<long long>> dp(full, vector<long long>(n, INF));\r\n\tdp[1][0] = 0;\r\n\r\n\tfor (int mask = 1; mask < full; ++mask)\r\n\t{\r\n\t\tfor (int i = 0; i < n; ++i)\r\n\t\t{\r\n\t\t\tif (!(mask & (1 << i)) || dp[mask][i] == INF)\r\n\t\t\t\tcontinue;\r\n\t\t\tfor (int j = 0; j < n; ++j)\r\n\t\t\t{\r\n\t\t\t\tif (mask & (1 << j))\r\n\t\t\t\t\tcontinue;\r\n\t\t\t\tint next_mask = mask | (1 << j);\r\n\t\t\t\tdp[next_mask][j] = min(dp[next_mask][j], dp[mask][i] + dist[i][j]);\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\r\n\tlong long ans = INF;\r\n\tfor (int i = 0; i < n; ++i)\r\n\t\tans = min(ans, dp[full - 1][i]);\r\n\tcout << ans << '\\n';\r\n\treturn 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-进阶-dagdp-cpp",
      "title": "DAGdp",
      "fileName": "DAGdp.cpp",
      "relativePath": "模板库/dp/进阶/DAGdp.cpp",
      "originalFolders": [
        "模板库",
        "dp",
        "进阶"
      ],
      "layers": [
        "动态规划",
        "进阶专题"
      ],
      "note": "包含数位 DP、状压 DP、树形 DP 等进阶模型。",
      "difficulty": "进阶",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "动态规划",
        "进阶专题",
        "DAGdp"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n  DAG DP 基础模板：有向无环图上的最长路。\r\n\r\n  模型：\r\n  给定 DAG 和起点 s，求从 s 到每个点的最长路。\r\n\r\n  做法：\r\n  先拓扑排序，再按拓扑序做 DP。\r\n\r\n  状态定义：\r\n  dp[u] 表示从 s 到 u 的最长路长度。\r\n\r\n  注意：\r\n  不可达状态不能初始化为 0，否则会污染答案，\r\n  应初始化为负无穷。\r\n*/\r\n\r\nconst long long NEG_INF = -(1LL << 60);\r\n\r\nint main()\r\n{\r\n\tios::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\r\n\tint n, m, s;\r\n\tcin >> n >> m >> s;\r\n\r\n\tvector<vector<pair<int, int>>> g(n + 1);\r\n\tvector<int> indeg(n + 1, 0);\r\n\r\n\tfor (int i = 0; i < m; ++i)\r\n\t{\r\n\t\tint u, v, w;\r\n\t\tcin >> u >> v >> w;\r\n\t\tg[u].push_back({v, w});\r\n\t\t++indeg[v];\r\n\t}\r\n\r\n\tqueue<int> q;\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t\tif (indeg[i] == 0)\r\n\t\t\tq.push(i);\r\n\r\n\tvector<int> topo;\r\n\twhile (!q.empty())\r\n\t{\r\n\t\tint u = q.front();\r\n\t\tq.pop();\r\n\t\ttopo.push_back(u);\r\n\t\tfor (auto [v, w] : g[u])\r\n\t\t{\r\n\t\t\tif (--indeg[v] == 0)\r\n\t\t\t\tq.push(v);\r\n\t\t}\r\n\t}\r\n\r\n\tvector<long long> dp(n + 1, NEG_INF);\r\n\tdp[s] = 0;\r\n\r\n\tfor (int u : topo)\r\n\t{\r\n\t\tif (dp[u] == NEG_INF)\r\n\t\t\tcontinue;\r\n\t\tfor (auto [v, w] : g[u])\r\n\t\t{\r\n\t\t\tdp[v] = max(dp[v], dp[u] + w);\r\n\t\t}\r\n\t}\r\n\r\n\tfor (int i = 1; i <= n; ++i)\r\n\t{\r\n\t\tif (dp[i] == NEG_INF)\r\n\t\t\tcout << -1;\r\n\t\telse\r\n\t\t\tcout << dp[i];\r\n\t\tcout << (i == n ? '\\n' : ' ');\r\n\t}\r\n\treturn 0;\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-区间覆盖问题-cpp",
      "title": "区间覆盖问题",
      "fileName": "区间覆盖问题.cpp",
      "relativePath": "模板库/dp/区间覆盖问题.cpp",
      "originalFolders": [
        "模板库",
        "dp"
      ],
      "layers": [
        "动态规划",
        "基础专题"
      ],
      "note": "存放 LIS、线性 DP、区间覆盖等基础 DP 模板。",
      "difficulty": "中级",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "动态规划",
        "基础专题",
        "区间覆盖问题"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\nconst ll Mod = 998244353;\r\n\r\n/*\r\n\t区间覆盖型 DP。\r\n\r\n\t题目模型可以概括成：\r\n\t给若干带权区间，求覆盖前缀中恰好若干个点的最小代价。\r\n\r\n\t状态定义：\r\n\tdp[i][j] 表示前 i 个位置里，恰好覆盖了 j 个点时的最小代价。\r\n\r\n\t常见转移思路：\r\n\t1. 不让位置 i 被最后一段覆盖，直接继承前一个前缀。\r\n\t2. 枚举“最后一段连续覆盖了多少个点”，把问题缩到更短前缀。\r\n\r\n\t这是非常典型的“最后一步 / 最后一段”模型。\r\n*/\r\n\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tint T;\r\n\tcin >> T;\r\n\tfor (int q = 0; q < T; ++q)\r\n\t{\r\n\t\tint n, m, k;\r\n\t\tcin >> n >> m >> k;\r\n\r\n\t\t// w[l][r] 预处理成“用一条区间刚好负责覆盖 [l, r] 这一段时的最小代价”。\r\n\t\tvector<vector<ll>> w(n + 1, vector<ll>(n + 1, LLONG_MAX));\r\n\r\n\t\tvector<vector<ll>> dp(n + 1, vector<ll>(n + 1, LLONG_MAX));\r\n\t\tfor (int i = 0; i < m; ++i)\r\n\t\t{\r\n\t\t\tint l, r;\r\n\t\t\tll cst;\r\n\t\t\tcin >> l >> r >> cst;\r\n\t\t\tfor (int j = l; j <= r; ++j)\r\n\t\t\t\tw[j][r] = min(w[j][r], cst);\r\n\t\t}\r\n\t\tfor (int i = 0; i <= n; ++i)\r\n\t\t\tdp[i][0] = 0;\r\n\t\tfor (int i = 1; i <= n; ++i)\r\n\t\t\tfor (int j = 1; j <= i; ++j)\r\n\t\t\t{\r\n\t\t\t\t// 情况 1：位置 i 不被最后一段覆盖。\r\n\t\t\t\tdp[i][j] = dp[i - 1][j];\r\n\r\n\t\t\t\t// 情况 2：最后一段连续覆盖了 t 个点，即 [i-t+1, i]。\r\n\t\t\t\tfor (int t = 1; t <= j; ++t)\r\n\t\t\t\t\tif (w[i - t + 1][i] != LLONG_MAX && dp[i - t][j - t] != LLONG_MAX)\r\n\t\t\t\t\t\tdp[i][j] = min(dp[i][j], dp[i - t][j - t] + w[i - t + 1][i]);\r\n\t\t\t}\r\n\t\tll ans = dp[n][k];\r\n\t\tcout << \"case #\" << q << \":\\n\";\r\n\t\tif (ans == LLONG_MAX)\r\n\t\t\tcout << \"-1\\n\";\r\n\t\telse\r\n\t\t\tcout << ans << \"\\n\";\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-修改字符串-cpp",
      "title": "修改字符串",
      "fileName": "修改字符串.cpp",
      "relativePath": "模板库/dp/修改字符串.cpp",
      "originalFolders": [
        "模板库",
        "dp"
      ],
      "layers": [
        "动态规划",
        "基础专题"
      ],
      "note": "存放 LIS、线性 DP、区间覆盖等基础 DP 模板。",
      "difficulty": "中级",
      "scenarios": [
        "字符串处理",
        "字符序列变换"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "动态规划",
        "基础专题",
        "修改字符串"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\n/*\r\n\t编辑距离模板。\r\n\r\n\t状态定义：\r\n\tdp[i][j] 表示把 s1 的前 i 个字符修改成 s2 的前 j 个字符的最小代价。\r\n\r\n\t最后一步有三种可能：\r\n\t1. 删除 s1 的最后一个字符：来自 dp[i-1][j] + 1\r\n\t2. 在 s1 末尾插入一个字符：来自 dp[i][j-1] + 1\r\n\t3. 把最后一个字符改成目标字符，或本来就相同：来自 dp[i-1][j-1] + cost\r\n\r\n\t这是非常典型的“前缀对前缀”二维 DP。\r\n*/\r\n\r\nint main()\r\n{\r\n\tint n;\r\n\tcin >> n;\r\n\tfor (int q = 0; q < n; ++q)\r\n\t{\r\n\t\tstring s1, s2;\r\n\t\tcin >> s1 >> s2;\r\n\t\tint l1 = s1.size(), l2 = s2.size();\r\n\r\n\t\t// 初值先设成一个很大的数，表示当前状态还没被合法转移更新到。\r\n\t\tvector<vector<int>> dp(l1 + 1, vector<int>(l2 + 1, 0x3ffffff));\r\n\r\n\t\t// 把前 i 个字符变成空串，只能一直删除。\r\n\t\tfor (int i = 0; i <= l1; ++i)\r\n\t\t\tdp[i][0] = i;\r\n\r\n\t\t// 把空串变成前 j 个字符，只能一直插入。\r\n\t\tfor (int j = 0; j <= l2; ++j)\r\n\t\t\tdp[0][j] = j;\r\n\r\n\t\tfor (int i = 1; i <= l1; ++i)\r\n\t\t\tfor (int j = 1; j <= l2; ++j)\r\n\t\t\t{\r\n\t\t\t\t// 情况 1：删除 s1 的最后一个字符。\r\n\t\t\t\tif (i - 1 >= 0)\r\n\t\t\t\t\tdp[i][j] = min(dp[i][j], dp[i - 1][j] + 1);\r\n\r\n\t\t\t\t// 情况 2：插入一个字符，让目标串的最后一个字符被补出来。\r\n\t\t\t\tif (j - 1 >= 0)\r\n\t\t\t\t\tdp[i][j] = min(dp[i][j], dp[i][j - 1] + 1);\r\n\r\n\t\t\t\t// 情况 3：处理两串的最后一个字符。\r\n\t\t\t\t// 若字符相同，代价为 0；否则相当于做一次替换，代价为 1。\r\n\t\t\t\tif (i - 1 >= 0 && j - 1 >= 0)\r\n\t\t\t\t\tdp[i][j] = min(dp[i][j], dp[i - 1][j - 1] + int(s1[i - 1] != s2[j - 1]));\r\n\t\t\t}\r\n\r\n\t\tcout << dp[l1][l2] << \"\\n\";\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-长n含m个1的字符串个数-cpp",
      "title": "长n含m个1的字符串个数",
      "fileName": "长n含m个1的字符串个数.cpp",
      "relativePath": "模板库/dp/长n含m个1的字符串个数.cpp",
      "originalFolders": [
        "模板库",
        "dp"
      ],
      "layers": [
        "动态规划",
        "基础专题"
      ],
      "note": "存放 LIS、线性 DP、区间覆盖等基础 DP 模板。",
      "difficulty": "中级",
      "scenarios": [
        "字符串处理",
        "字符序列变换"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "动态规划",
        "基础专题",
        "长n含m个1的字符串个数"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\n\r\n/*\r\n\t计数 DP：统计长度为 n 的二进制串中，至少出现一次连续 m 个 1 的方案数。\r\n\r\n\t常用思路：正面直接统计“至少出现一次”较难，改成补集更自然：\r\n\t1. 先统计“不含连续 m 个 1”的方案数。\r\n\t2. 再用总串数 2^n 减掉它。\r\n\r\n\t状态定义：\r\n\tdp[i][j] 表示长度为 i，且末尾连续 1 的个数恰好为 j 的合法串数。\r\n\r\n\t这里只依赖上一层，因此可以使用滚动数组压空间。\r\n*/\r\n\r\nint main()\r\n{\r\n\tint n, m;\r\n\twhile (true)\r\n\t{\r\n\t\tcin >> n >> m;\r\n\t\tif (n == -1 && m == -1)\r\n\t\t\tbreak;\r\n\r\n\t\t// 这里只开两层：当前层和上一层。\r\n\t\tvector<vector<ll>> dp(2, vector<ll>(m, 0));\r\n\t\tdp[1][1] = dp[1][0] = 1;\r\n\t\tfor (int i = 2; i <= n; ++i)\r\n\t\t{\r\n\t\t\t// 末尾补 0：之前任何合法状态都能转来，且连续 1 长度清零。\r\n\t\t\tdp[i % 2][0] = 0;\r\n\t\t\tfor (int j = 0; j < m; ++j)\r\n\t\t\t\tdp[i % 2][0] += dp[(i - 1) % 2][j];\r\n\r\n\t\t\t// 末尾补 1：只能从“连续 1 长度少 1”的状态转移过来。\r\n\t\t\tfor (int j = 1; j < m; ++j)\r\n\t\t\t{\r\n\t\t\t\tdp[i % 2][j] = dp[(i - 1) % 2][j - 1];\r\n\t\t\t}\r\n\t\t}\r\n\r\n\t\t// 最后用总方案数减去补集。\r\n\t\tll ans = (ll)1 << n;\r\n\t\tfor (int j = 0; j < m; ++j)\r\n\t\t\tans -= dp[n % 2][j];\r\n\t\tcout << ans << \"\\n\";\r\n\t}\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-lis-cpp",
      "title": "LIS",
      "fileName": "LIS.cpp",
      "relativePath": "模板库/dp/LIS.cpp",
      "originalFolders": [
        "模板库",
        "dp"
      ],
      "layers": [
        "动态规划",
        "基础专题"
      ],
      "note": "存放 LIS、线性 DP、区间覆盖等基础 DP 模板。",
      "difficulty": "中级",
      "scenarios": [
        "最长上升子序列",
        "序列优化问题"
      ],
      "signals": [
        "关注上升关系",
        "需要优化序列状态"
      ],
      "risks": [
        "贪心版和 DP 版含义不同",
        "二分数组维护的不是实际答案序列"
      ],
      "keywords": [
        "动态规划",
        "基础专题",
        "LIS",
        "上升子序列",
        "贪心"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nconst int N = 5005;\r\n\r\n/*\r\n  最长上升子序列（LIS）朴素模板。\r\n\r\n  状态定义：\r\n  dp[i] 表示“以 a[i] 结尾”的最长上升子序列长度。\r\n\r\n  为什么这样定义：\r\n  因为 LIS 的最后一个数一旦固定为 a[i]，它前面能接谁就只和 j < i 且 a[j] < a[i] 有关。\r\n\r\n  转移：\r\n  dp[i] = max(dp[j] + 1), 其中 0 <= j < i 且 a[j] < a[i]\r\n\r\n  复杂度：\r\n  O(n^2)，适合作为 LIS 的入门写法和状态设计范例。\r\n*/\r\n\r\nint lis(int n, vector<int> &a)\r\n{\r\n\tvector<int> dp(n, 1);\r\n\tint ans = 0;\r\n\tfor (int i = 0; i < n; ++i)\r\n\t{\r\n\t\t// 枚举 i 前面的所有位置 j，尝试把 a[i] 接到对应 LIS 后面。\r\n\t\tfor (int j = 0; j < i; ++j)\r\n\t\t\tif (a[i] > a[j])\r\n\t\t\t\tdp[i] = max(dp[i], dp[j] + 1);\r\n\r\n\t\t// 注意答案不是 dp[n-1]，而是所有“以 i 结尾”的情况里的最大值。\r\n\t\tans = max(ans, dp[i]);\r\n\t}\r\n\treturn ans;\r\n}\r\n\r\nint main()\r\n{\r\n\tint n;\r\n\tcin >> n;\r\n\tvector<int> a(n);\r\n\tfor (int i = 0; i < n; ++i)\r\n\t\tcin >> a[i];\r\n\tcout << lis(n, a);\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "dp-lis贪心-二分-cpp",
      "title": "LIS贪心+二分",
      "fileName": "LIS贪心+二分.cpp",
      "relativePath": "模板库/dp/LIS贪心+二分.cpp",
      "originalFolders": [
        "模板库",
        "dp"
      ],
      "layers": [
        "动态规划",
        "基础专题"
      ],
      "note": "存放 LIS、线性 DP、区间覆盖等基础 DP 模板。",
      "difficulty": "中级",
      "scenarios": [
        "答案具有单调性",
        "边界定位问题"
      ],
      "signals": [
        "答案范围可枚举",
        "满足性随答案单调变化"
      ],
      "risks": [
        "边界更新不当会死循环",
        "要分清找左边界还是右边界"
      ],
      "keywords": [
        "动态规划",
        "基础专题",
        "LIS贪心+二分",
        "单调性",
        "边界",
        "上升子序列",
        "贪心"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\ntypedef long long ll;\r\n\r\n/*\r\n\tLIS 贪心 + 二分优化模板。\r\n\r\n\t核心维护量：\r\n\tt[len - 1] 表示“长度为 len 的上升子序列的最小可能结尾值”。\r\n\r\n\t为什么维护最小结尾：\r\n\t对同样长度的上升子序列来说，结尾越小，后面越容易接新元素。\r\n\r\n\t更新方式：\r\n\t1. 若当前值比所有结尾都大，则可以新开一个更长的 LIS。\r\n\t2. 否则用它去替换第一个 >= 它的位置，保持同长度下结尾尽量小。\r\n\r\n\t注意：\r\n\t这个写法一般只能直接求 LIS 长度；若要求具体方案，需要额外记录前驱。\r\n*/\r\n\r\nint main()\r\n{\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tint n;\r\n\tcin >> n;\r\n\tvector<int> a(n), b(n + 1);\r\n\tfor (int i = 0; i < n; ++i)\r\n\t\tcin >> a[i];\r\n\tfor (int i = 0; i < n; ++i)\r\n\t{\r\n\t\tint x;\r\n\t\tcin >> x;\r\n\t\tb[x] = i + 1;\r\n\t}\r\n\tfor (int i = 0; i < n; ++i)\r\n\t\ta[i] = b[a[i]];\r\n\tvector<int> t;\r\n\tfor (int i = 0; i < n; ++i)\r\n\t{\r\n\t\t// 找到第一个 >= a[i] 的位置。\r\n\t\t// 若存在，就用 a[i] 更新该长度的最优结尾；否则扩展 LIS 长度。\r\n\t\tauto it = lower_bound(t.begin(), t.end(), a[i]);\r\n\t\tif (it == t.end())\r\n\t\t\tt.push_back(a[i]);\r\n\t\telse\r\n\t\t\t*it = a[i];\r\n\t}\r\n\tcout << t.size();\r\n}\r\n",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    },
    {
      "id": "test-cpp",
      "title": "test",
      "fileName": "test.cpp",
      "relativePath": "模板库/test.cpp",
      "originalFolders": [
        "模板库"
      ],
      "layers": [
        "总览",
        "调试与试验"
      ],
      "note": "用于临时测试或验证片段代码。",
      "difficulty": "基础",
      "scenarios": [
        "通用代码骨架",
        "需要按题意手动改造"
      ],
      "signals": [
        "先识别题型特征",
        "再决定是否调用此模板"
      ],
      "risks": [
        "需要根据题目手动补全边界条件",
        "使用前先确认输入规模和适用范围"
      ],
      "keywords": [
        "总览",
        "调试与试验",
        "test"
      ],
      "code": "#include <bits/stdc++.h>\r\nusing namespace std;\r\nusing ll=long long;\r\nll qp(ll x,ll n,ll Mod){\r\n\tll ans=1;\r\n\twhile(n>0){\r\n\t\tif(n&1) ans=ans*x%Mod;\r\n\t\tx=x*x%Mod;\r\n\t\tn>>=1;\r\n\t}\r\n\treturn ans;\r\n}\r\nint main(){\r\n\tios_base::sync_with_stdio(false);\r\n\tcin.tie(nullptr);\r\n\tcout<<(qp(2,4042,1e9+7)+qp(2,2021,1e9+7))%ll(1e9+7);\r\n}",
      "metadataSource": "rule-based",
      "metadataUpdatedAt": null
    }
  ]
};
