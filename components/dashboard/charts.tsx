"use client";

import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";

const colors = ["#2563eb", "#7c3aed", "#0ea5e9", "#16a34a", "#f97316", "#dc2626"];

export function BarViz({ data, x = "name", y = "value" }: { data: Record<string, string | number>[]; x?: string; y?: string }) {
  return <ResponsiveContainer width="100%" height={280}><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={x} /><YAxis /><Tooltip /><Bar dataKey={y}>{data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Bar></BarChart></ResponsiveContainer>;
}

export function LineViz({ data }: { data: Record<string, string | number>[] }) {
  return <ResponsiveContainer width="100%" height={280}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} /></LineChart></ResponsiveContainer>;
}

export function PieViz({ data }: { data: Record<string, string | number>[] }) {
  return <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>{data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>;
}
