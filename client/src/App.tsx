import { useEffect } from "react";
import Ticket from "./pages/Ticket/Ticket";
import { Member } from "./pages/Member/Member";
import Login from "./pages/Login/Login";
import { useAuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HoldRequest from "./pages/Request/HoldRequest/HoldRequest";
import TransferRequest from "./pages/Request/TransferRequest/TransferRequest";
import { useSideBarContext } from "./context/SideBarContext";
import SideBar from "./components/Sidebar/Sidebar";
import NavBar from "./components/Navbar/Navbar";
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import IncomeReport from "./pages/Report/IncomeReport";
import { MemberPriceTable } from "./pages/PriceTable/MemberPriceTable";
import { CustomerReport } from "./pages/Report/CustomerReport";
import CustomerTypeReport from "./pages/Report/CustomerTypeReport";

function NoMatch() {
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </a>
            <a href="#" className="text-sm font-semibold text-gray-900">
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  )
}

function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-2xl font-semibold mb-1">10</div>
              <div className="text-sm font-medium text-gray-400">Active orders</div>
            </div>
            <div className="dropdown">
              <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600"><i className="ri-more-fill"></i></button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-full bg-gray-100 rounded-full h-4">
              <div className="h-full bg-blue-500 rounded-full p-1" style={{ width: "60%" }}>
                <div className="w-2 h-2 rounded-full bg-white ml-auto"></div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600 ml-4">60%</span>
          </div>
        </div>
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-4">
            <div>
              <div className="flex items-center mb-1">
                <div className="text-2xl font-semibold">324</div>
                <div className="p-1 rounded bg-emerald-500/10 text-emerald-500 text-[12px] font-semibold leading-none ml-2">+30%</div>
              </div>
              <div className="text-sm font-medium text-gray-400">Visitors</div>
            </div>
            <div className="dropdown">
              <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600"><i className="ri-more-fill"></i></button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center">
            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded-full object-cover block" />
            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded-full object-cover block -ml-3" />
            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded-full object-cover block -ml-3" />
            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded-full object-cover block -ml-3" />
            <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded-full object-cover block -ml-3" />
          </div>
        </div>
        <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
          <div className="flex justify-between mb-6">
            <div>
              <div className="text-2xl font-semibold mb-1"><span className="text-base font-normal text-gray-400 align-top">&dollar;</span>2,345</div>
              <div className="text-sm font-medium text-gray-400">Active orders</div>
            </div>
            <div className="dropdown">
              <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600"><i className="ri-more-fill"></i></button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                </li>
              </ul>
            </div>
          </div>
          <a href="#" className="text-blue-500 font-medium text-sm hover:text-blue-600">View details</a>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
          <div className="flex justify-between mb-4 items-start">
            <div className="font-medium">Manage orders</div>
            <div className="dropdown">
              <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600"><i className="ri-more-fill"></i></button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center mb-4 order-tab">
            <button type="button" data-tab="order" data-tab-page="active" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tl-md rounded-bl-md hover:text-gray-600 active">Active</button>
            <button type="button" data-tab="order" data-tab-page="completed" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 hover:text-gray-600">Completed</button>
            <button type="button" data-tab="order" data-tab-page="canceled" className="bg-gray-50 text-sm font-medium text-gray-400 py-2 px-4 rounded-tr-md rounded-br-md hover:text-gray-600">Canceled</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px]" data-tab-for="order" data-page="active">
              <thead>
                <tr>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Service</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Estimate</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Budget</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">In progress</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">In progress</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">In progress</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">In progress</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">In progress</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full min-w-[540px] hidden" data-tab-for="order" data-page="completed">
              <thead>
                <tr>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Service</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Estimate</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Budget</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">Completed</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">Completed</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">Completed</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">Completed</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full min-w-[540px] hidden" data-tab-for="order" data-page="canceled">
              <thead>
                <tr>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Service</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Estimate</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Budget</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">Canceled</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">Canceled</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">Canceled</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">Canceled</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">3 days</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$56</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">Canceled</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
          <div className="flex justify-between mb-4 items-start">
            <div className="font-medium">Manage Services</div>
            <div className="dropdown">
              <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600"><i className="ri-more-fill"></i></button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                </li>
              </ul>
            </div>
          </div>
          <form action="" className="flex items-center mb-4">
            <div className="relative w-full mr-2">
              <input type="text" className="py-2 pr-4 pl-10 bg-gray-50 w-full outline-none border border-gray-100 rounded-md text-sm focus:border-blue-500" placeholder="Search..." />
              <i className="ri-search-line absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"></i>
            </div>
            <select className="text-sm py-2 pl-4 pr-10 bg-gray-50 border border-gray-100 rounded-md focus:border-blue-500 outline-none appearance-none bg-select-arrow bg-no-repeat bg-[length:16px_16px] bg-[right_16px_center]">
              <option value="">All</option>
            </select>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[540px]">
              <thead>
                <tr>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Service</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Price</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Clicks</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md"></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">1K</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="dropdown">
                      <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600 text-sm w-6 h-6 rounded flex items-center justify-center bg-gray-50"><i className="ri-more-2-fill"></i></button>
                      <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">1K</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="dropdown">
                      <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600 text-sm w-6 h-6 rounded flex items-center justify-center bg-gray-50"><i className="ri-more-2-fill"></i></button>
                      <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">1K</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="dropdown">
                      <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600 text-sm w-6 h-6 rounded flex items-center justify-center bg-gray-50"><i className="ri-more-2-fill"></i></button>
                      <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">1K</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="dropdown">
                      <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600 text-sm w-6 h-6 rounded flex items-center justify-center bg-gray-50"><i className="ri-more-2-fill"></i></button>
                      <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-gray-400">1K</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="dropdown">
                      <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600 text-sm w-6 h-6 rounded flex items-center justify-center bg-gray-50"><i className="ri-more-2-fill"></i></button>
                      <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                        </li>
                        <li>
                          <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md lg:col-span-2">
          <div className="flex justify-between mb-4 items-start">
            <div className="font-medium">Order Statistics</div>
            <div className="dropdown">
              <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600"><i className="ri-more-fill"></i></button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="rounded-md border border-dashed border-gray-200 p-4">
              <div className="flex items-center mb-0.5">
                <div className="text-xl font-semibold">10</div>
                <span className="p-1 rounded text-[12px] font-semibold bg-blue-500/10 text-blue-500 leading-none ml-1">$80</span>
              </div>
              <span className="text-gray-400 text-sm">Active</span>
            </div>
            <div className="rounded-md border border-dashed border-gray-200 p-4">
              <div className="flex items-center mb-0.5">
                <div className="text-xl font-semibold">50</div>
                <span className="p-1 rounded text-[12px] font-semibold bg-emerald-500/10 text-emerald-500 leading-none ml-1">+$469</span>
              </div>
              <span className="text-gray-400 text-sm">Completed</span>
            </div>
            <div className="rounded-md border border-dashed border-gray-200 p-4">
              <div className="flex items-center mb-0.5">
                <div className="text-xl font-semibold">4</div>
                <span className="p-1 rounded text-[12px] font-semibold bg-rose-500/10 text-rose-500 leading-none ml-1">-$130</span>
              </div>
              <span className="text-gray-400 text-sm">Canceled</span>
            </div>
          </div>
          <div>
            <canvas id="order-chart"></canvas>
          </div>
        </div>
        <div className="bg-white border border-gray-100 shadow-md shadow-black/5 p-6 rounded-md">
          <div className="flex justify-between mb-4 items-start">
            <div className="font-medium">Earnings</div>
            <div className="dropdown">
              <button type="button" className="dropdown-toggle text-gray-400 hover:text-gray-600"><i className="ri-more-fill"></i></button>
              <ul className="dropdown-menu shadow-md shadow-black/5 z-30 hidden py-1.5 rounded-md bg-white border border-gray-100 w-full max-w-[140px]">
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Profile</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Settings</a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-[13px] py-1.5 px-4 text-gray-600 hover:text-blue-500 hover:bg-gray-50">Logout</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px]">
              <thead>
                <tr>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tl-md rounded-bl-md">Service</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left">Earning</th>
                  <th className="text-[12px] uppercase tracking-wide font-medium text-gray-400 py-2 px-4 bg-gray-50 text-left rounded-tr-md rounded-br-md">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-emerald-500">+$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">Pending</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-rose-500">-$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">Withdrawn</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-emerald-500">+$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">Pending</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-rose-500">-$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">Withdrawn</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-emerald-500">+$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">Pending</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-rose-500">-$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">Withdrawn</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-emerald-500">+$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">Pending</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-rose-500">-$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">Withdrawn</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-emerald-500">+$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-emerald-500/10 text-emerald-500 font-medium text-[12px] leading-none">Pending</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <div className="flex items-center">
                      <img src="https://placehold.co/32x32" alt="" className="w-8 h-8 rounded object-cover block" />
                      <a href="#" className="text-gray-600 text-sm font-medium hover:text-blue-500 ml-2 truncate">Create landing page</a>
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="text-[13px] font-medium text-rose-500">-$235</span>
                  </td>
                  <td className="py-2 px-4 border-b border-b-gray-50">
                    <span className="inline-block p-1 rounded bg-rose-500/10 text-rose-500 font-medium text-[12px] leading-none">Withdrawn</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "*",
    Component: NoMatch,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "/",
        Component: Dashboard,
      },
      {
        path: "/ticket",
        Component: Ticket,
      },
      {
        path: "/member",
        Component: Member,
      },
      {
        path: "/member_price_table",
        Component: MemberPriceTable,
      },
      {
        path: "/hold_request",
        Component: HoldRequest,
      },
      {
        path: "/transfer_request",
        Component: TransferRequest,
      },
      {
        path: "/income_report",
        Component: IncomeReport,
      },
      {
        path: "/customer_report",
        Component: CustomerReport,
      },
      {
        path: "/customer_type_report",
        Component: CustomerTypeReport,
      },
    ],
  },
]);

function App() {

  const { checkAuth, isAuthenticated, setIsLoading } = useAuthContext();

  const authenticate = async () => {
    setIsLoading(true);
    await checkAuth();
    setIsLoading(false);
  };

  useEffect(() => {
    authenticate();
  }, []);

  if (!isAuthenticated) return <Login />;

  return (
    <>
      <RouterProvider router={router} /> <ToastContainer />
    </>
  )

}

function Layout() {
  const { expanded, setExpanded } = useSideBarContext();
  return (
    <>
      <SideBar />
      <div className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 md:hidden ${expanded ? "" : "hidden"}`} onClick={() => setExpanded((curr) => !curr)}></div>
      <main className={`w-full bg-gray-50 min-h-screen transition-all ${expanded ? "md:ml-64 md:w-[calc(100%-256px)]" : ""}`}>
        <NavBar />
        <div className="p-3">
          <Outlet />
        </div>
      </main>
    </>
  )
}
export default App;
