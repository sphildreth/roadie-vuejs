export default function getEnv(name) {
    if(window.configs)
    {
        return window.configs[name];
    }
    // The intent is to pass these values vie '-e' options via docker run 
    switch (name) {
        case 'ROADIE_API_URL':
            return 'https://www.roadie.rocks:8080';
        case 'ROADIE_VUE_APP_NAME':
            return 'Jamz (DEMO)';
        case 'ROADIE_VUE_APP_IS_DEBUG':
            return false;
    }
}