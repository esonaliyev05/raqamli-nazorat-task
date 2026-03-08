import { Link, NavLink } from 'react-router-dom'
import type { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-[20px] font-bold tracking-tight">
            Bank Statements
          </Link>

          <div className="flex items-center gap-3">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/create"
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              Create
            </NavLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  )
}
