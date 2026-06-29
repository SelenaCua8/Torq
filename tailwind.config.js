import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                // Inter como font principal — consistente con el diseño Torq
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                torq: {
                    orange:  '#F5A623',
                    orange2: '#E8941A',
                    black:   '#0a0a0a',
                    dark:    '#111111',
                    card:    '#161616',
                    border:  '#222222',
                    muted:   '#2a2a2a',
                    text:    '#E8E8E8',
                    sub:     '#888888',
                }
            }
        },
    },
    plugins: [forms],
};
