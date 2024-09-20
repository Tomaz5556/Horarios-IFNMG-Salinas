export const fetchEnsinoMedioData = async () => {
    const response = await fetch("http://localhost:8080/ensinoMedio");
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    return response.json();
};