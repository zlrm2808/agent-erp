"use client";

import {
  RibbonMenu, RibbonGroup, RibbonBtnLarge, RibbonBtnSmall,
  RibbonBtnIcon, RibbonCheck, RibbonCombo
} from './RibbonElements';

export default function MainRibbon() {
  return (
    <div className="flex flex-col w-full shadow-sm bg-white dark:bg-slate-900">
      {/* 1. Navbar Superior */}
      <RibbonMenu
        tabs={['Home', 'Actions', 'Navigate', 'Report', 'Request Approval']}
        activeTab="Actions"
      />

      {/* Contenedor de Grupos */}
      <div className="flex items-stretch h-20 overflow-x-auto no-scrollbar">

        {/* Grupo Workflow */}
        <RibbonGroup label="Workflow">
          <RibbonBtnLarge icon="check_circle_outline" label="Release" color="text-blue-500" />
          <RibbonBtnLarge icon="lock_open" label="Reopen" color="text-slate-600" />
        </RibbonGroup>

        {/* Grupo Communication */}
        <RibbonGroup label="Communication">
          <div className="flex flex-col justify-center">
            <RibbonBtnSmall icon="email" label="Send to Email" />
            <RibbonBtnSmall icon="send_and_archive" label="Post and Email" />
          </div>
        </RibbonGroup>

        {/* Grupo Output (Mezclado) */}
        <RibbonGroup label="Output">
          <RibbonBtnLarge icon="print" label="Print" color="text-slate-700" />
          <div className="flex flex-col justify-center">
            <RibbonBtnSmall icon="table_view" label="Export to Excel" color="text-green-600" />
            <RibbonBtnSmall icon="picture_as_pdf" label="PDF Preview" color="text-red-600" />
          </div>
        </RibbonGroup>

        {/* Grupo de Configuración (Checks y Combo) */}
        <RibbonGroup label="Config">
          <div className="flex flex-col justify-center space-y-1">
            <RibbonCheck label="Auto-save" checked={true} />
            <RibbonCombo options={['v1.0', 'v1.1', 'v2.0']} />
          </div>
          <RibbonBtnIcon icon="settings" />
        </RibbonGroup>

      </div>
    </div>
  );
}