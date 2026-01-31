
export function getInitials(name: string) {
    if (!name) return "??";
    // If it's a phone number (digits only), take last 2
    if (/^\d+$/.test(name)) return name.slice(-2);

    // Otherwise take initials
    return name
        .split(" ")
        .map(n => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export function getAvatarColor(key: string) {
    const colors = [
        "bg-red-100 text-red-600",
        "bg-orange-100 text-orange-600",
        "bg-amber-100 text-amber-600",
        "bg-green-100 text-green-600",
        "bg-emerald-100 text-emerald-600",
        "bg-teal-100 text-teal-600",
        "bg-cyan-100 text-cyan-600",
        "bg-blue-100 text-blue-600",
        "bg-indigo-100 text-indigo-600",
        "bg-violet-100 text-violet-600",
        "bg-purple-100 text-purple-600",
        "bg-fuchsia-100 text-fuchsia-600",
        "bg-pink-100 text-pink-600",
        "bg-rose-100 text-rose-600",
    ];

    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = key.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}
