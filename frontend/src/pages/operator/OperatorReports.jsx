import React, { useState, useEffect } from 'react';
import { operatorApi } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { FileText, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const OperatorReports = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    operatorApi.getDashboard().then(setData).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shift Operations & Performance Summary</h1>
            <p className="text-xs text-slate-500 mt-1">
              Personal reporting metrics for shift handovers and supervisory review.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Verified Sign-Offs"
              value={data?.approved_activities || 0}
              icon={CheckCircle}
              color="emerald"
              subtitle="Quality-approved logs"
            />
            <StatCard
              title="Tasks Executed"
              value={data?.total_assigned_tasks || 0}
              icon={TrendingUp}
              color="blue"
              subtitle="Current operational queue"
            />
            <StatCard
              title="Assigned Station"
              value={data?.operator_id || 'IND-OP-0001'}
              icon={FileText}
              color="indigo"
              subtitle={data?.department}
            />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-xs text-slate-600">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Shift Handover Guidelines</h3>
            <p className="leading-relaxed mb-4">
              All hydraulic pressure readings, torque logs, and physical test specimens must be recorded with exact quantities before shift conclusion. Incomplete tasks will automatically carry over to the subsequent shift operator under continuous chain-of-custody tracking.
            </p>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Operator Telemetry Validated & Compliant with Site Safety Directives.</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OperatorReports;
