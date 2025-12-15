export async function load() {
    const res = await fetch("http://localhost:3000/parking_status");
    const data = await res.json();
    return {
      ticket: data
    };
}