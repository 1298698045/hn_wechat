const dayjs = require('dayjs');

export const getTotal = function(options) {
    // {
    //   // 上班时间
    //   startWorkTime,
    //     // 下班时间
    //     endWorkTime,
    //     // 请假开始时间
    //     beginAt,
    //     // 请假结束时间
    //     endAt,
    //     // 是否去除午休时间
    //     excludeFreeTime,
    //     // 午休开始时间
    //     startFreeTime,
    //     // 午休结束时间
    //     endFreeTime
    //     //剔除日期数组
    //     excludeDates
    // }
    if (dayjs(options.beginAt).isAfter(dayjs(options.endAt))) {
        [options.beginAt, options.endAt] = [options.endAt, options.beginAt];
    }

    options.excludeDates = options.excludeDates.map(d => dayjs(d));

    let minute = 0;

    const diffDay = dayjs(options.endAt).startOf('day').diff(dayjs(options.beginAt).startOf('day'), 'day');

    for (let i = 0; i <= diffDay; i++) {
        const day = dayjs(options.beginAt).add(i, 'day').startOf('day');

        if (options.excludeDates.some(d => d.isSame(day, 'date'))) {
            continue;
        }

        const startWorkAt = day.minute(options.startWorkTime * 60);
        const endWorkAt = day.minute(options.endWorkTime * 60);
        const startFreeAt = day.minute(options.startFreeTime * 60);
        const endFreeAt = day.minute(options.endFreeTime * 60);
        let beginAt = dayjs(options.beginAt);
        beginAt = beginAt.isBefore(startWorkAt) ? startWorkAt : beginAt.isAfter(endWorkAt) ? endWorkAt : beginAt;
        let endAt = dayjs(options.endAt);
        endAt = endAt.isAfter(endWorkAt) ? endWorkAt : endAt;
        if (options.excludeFreeTime) {
            beginAt = (beginAt.isAfter(startFreeAt) && beginAt.isBefore(endFreeAt)) ? endFreeAt : beginAt;
            endAt = (endAt.isAfter(startFreeAt) && endAt.isBefore(endFreeAt)) ? startFreeAt : endAt;
        }

        let ranges = [];

        if (diffDay === 0) {
            if (options.excludeFreeTime && beginAt.isBefore(startFreeAt) && endAt.isAfter(endFreeAt)) {
                ranges = [
                    [beginAt, startFreeAt],
                    [endFreeAt, endAt]
                ];
            } else {
                ranges = [
                    [beginAt, endAt]
                ];
            }
        } else if (i === 0) {
            if (options.excludeFreeTime) {
                ranges = beginAt.isBefore(startFreeAt) ? [
                    [beginAt, startFreeAt],
                    [endFreeAt, endWorkAt]
                ] : [
                    [beginAt, endWorkAt]
                ];
            } else {
                ranges = [
                    [beginAt, endWorkAt]
                ];
            }
        } else if (i === diffDay) {
            if (options.excludeFreeTime) {
                ranges = endAt.isBefore(startFreeAt) ? [
                    [startWorkAt, endAt]
                ] : [
                    [startWorkAt, startFreeAt],
                    [endFreeAt, endAt]
                ];
            } else {
                ranges = [
                    [startWorkAt, endAt]
                ];
            }
        } else {
            if (options.excludeFreeTime) {
                ranges = [
                    [startWorkAt, startFreeAt],
                    [endFreeAt, endWorkAt]
                ];
            } else {
                ranges = [
                    [startWorkAt, endWorkAt]
                ];
            }
        }

        console.log(ranges.map(r => {
            return r.map(d => d.format('YYYY-MM-DD HH:mm:ss'));
        }), ranges.map(range => {
            const diff = range[1].diff(range[0], 'minute');
            if (diff < 0) {
                return 0;
            }
            return diff;
        }).reduce((a, b) => a + b, 0));

        minute += ranges.map(range => {
            const diff = range[1].diff(range[0], 'minute');
            if (diff < 0) {
                return 0;
            }
            return diff;
        }).reduce((a, b) => a + b, 0);

    }
    console.log(`
分钟: ${ minute }
小时: ${ parseFloat((minute / 60).toFixed(2)) }
  `);
    return parseFloat((minute / 60).toFixed(2));
}