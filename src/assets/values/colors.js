"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentColors = exports.colors = void 0;
exports.getColors = getColors;
exports.getComponentColors = getComponentColors;
exports.colors = {
    primary: {
        DEFAULT: '#4aa3c6',
        50: '#f0f9fb',
        100: '#d8eef5',
        200: '#b6deeb',
        300: '#83c4dd',
        400: '#4aa3c6',
        500: '#2e86ab',
        600: '#296d91',
        700: '#275a77',
        800: '#284b62',
        900: '#254054',
        950: '#142938',
    },
    secondary: {
        DEFAULT: '#6e6d6c',
        50: '#f6f5f5',
        100: '#e7e6e6',
        200: '#d1d0d0',
        300: '#b1b0af',
        400: '#898887',
        500: '#6e6d6c',
        600: '#5e5d5c',
        700: '#565554',
        800: '#464644',
        900: '#3d3c3c',
        950: '#262626',
    },
    success: {
        DEFAULT: '#2ba19e',
        50: '#f2fbfa',
        100: '#ccf3ee',
        200: '#a6e9e2',
        300: '#71d7d0',
        400: '#44bdb8',
        500: '#2ba19e',
        600: '#208181',
        700: '#1d6868',
        800: '#1c5153',
        900: '#1b4546',
        950: '#0a2729',
    },
    info: {
        DEFAULT: '#109fe7',
        50: '#f0f9ff',
        100: '#cee9fd',
        200: '#bbe4fc',
        300: '#7ed0fb',
        400: '#3ab7f6',
        500: '#109fe7',
        600: '#047ec5',
        700: '#0465a0',
        800: '#085684',
        900: '#0d486d',
        950: '#092d48',
    },
    warning: {
        DEFAULT: '#ec7c23',
        50: '#fef8ee',
        100: '#fce9cc',
        200: '#f9d9af',
        300: '#f5be7c',
        400: '#f09947',
        500: '#ec7c23',
        600: '#de6218',
        700: '#b84a16',
        800: '#923c1a',
        900: '#763318',
        950: '#40180a',
    },
    danger: {
        DEFAULT: '#ee4945',
        50: '#fef2f2',
        100: '#fee3e2',
        200: '#fed6d5',
        300: '#fca7a5',
        400: '#f77572',
        500: '#ee4945',
        600: '#db2b27',
        700: '#b8211d',
        800: '#981f1c',
        900: '#7f1f1d',
        950: '#450b0a',
    },
    gray: {
        DEFAULT: '#fbfbfb',
        50: '#fbfbfb',
        100: '#f2f4f8',
        200: '#e9ecef',
        300: '#dee2e6',
        400: '#ced4da',
        500: '#768B9E',
        600: '#6c757d',
        700: '#4f5467',
        800: '#343a40',
        900: '#374550',
        950: '#343e46',
    },
};
exports.componentColors = {
    primary: __assign(__assign({}, exports.colors.primary), { color: exports.colors.primary[400], text: '#fff' }),
    secondary: __assign(__assign({}, exports.colors.secondary), { color: exports.colors.secondary[400], text: '#fff' }),
    success: __assign(__assign({}, exports.colors.success), { color: exports.colors.success[400], text: '#fff' }),
    info: __assign(__assign({}, exports.colors.info), { color: exports.colors.info[400], text: '#fff' }),
    warning: __assign(__assign({}, exports.colors.warning), { color: exports.colors.warning[400], text: '#fff' }),
    danger: __assign(__assign({}, exports.colors.danger), { color: exports.colors.danger[400], text: '#fff' }),
    gray: __assign(__assign({}, exports.colors.gray), { color: exports.colors.gray[50], text: exports.colors.gray[600] }),
};
function getColors(color, shade) {
    if (!color) {
        return Object.keys(exports.colors);
    }
    var variants = exports.colors[color];
    if (!variants) {
        return undefined;
    }
    if (!shade) {
        return Object.keys(variants);
    }
    return variants[shade];
}
function getComponentColors(color) {
    if (!color) {
        return Object.entries(exports.componentColors).map(function (_a) {
            var key = _a[0], value = _a[1];
            return (__assign({ name: key }, value));
        });
    }
    return exports.componentColors[color];
}
