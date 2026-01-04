'use client';
import { QRCodeSVG } from 'qrcode.react';

const hexToBase64 = (hex: string) => {
    try {
        const match = hex.match(/\w{2}/g);
        if (!match) return hex;
        return btoa(match.map((a) => String.fromCharCode(parseInt(a, 16))).join(""));
    } catch (e) {
        return hex;
    }
};

export function ClientQRCode({ value }: { value: string }) {
    // 1. Try to compress if it looks like a long hex string (common for Dilithium keys)
    let displayValue = value;
    let isBase64 = false;

    if (value.length > 1000 && /^[0-9a-fA-F]+$/.test(value)) {
        displayValue = hexToBase64(value);
        isBase64 = true;
    }

    // 2. Check if the (potentially compressed) value fits in a QR code
    // Max alphanumeric chars for Version 40 L is ~4296
    if (displayValue.length > 4200) {
        return (
            <div className="bg-white/10 p-4 rounded-lg text-center flex flex-col items-center justify-center h-32 w-32 border border-white/10">
                <span className="text-xs text-gray-400">Address too long</span>
            </div>
        );
    }

    return (
        <div className="bg-white p-2 rounded-lg flex flex-col items-center gap-2">
            <QRCodeSVG value={displayValue} size={128} level="L" />
            {isBase64 && <span className="text-[10px] text-gray-500 font-mono">Base64 Encoded</span>}
        </div>
    );
}
