import React from 'react';
import { Project } from '../types';
import { BookOpen, Trash2, Calendar, Film, User, Clock, FileText, PlusCircle } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onDeleteProject: (id: string, e: React.MouseEvent) => void;
  onNewProject: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onDeleteProject,
  onNewProject,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-800 text-sm">المشاريع المحفوظة والمحفوظات</h3>
        </div>
        <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
          {projects.length}
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 text-slate-400 space-y-3">
          <FileText className="w-10 h-10 mx-auto opacity-40 text-slate-300" />
          <p className="text-xs leading-relaxed max-w-[200px] mx-auto">
            لا تملك مشاريع محفوظة حالياً. بمجرد إنشاء السكربت الأول، سيتم حفظه تلقائياً هنا للرجوع إليه وتعديله في أي وقت.
          </p>
          <button
            onClick={onNewProject}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 py-1.5 px-3 rounded-lg transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            بدء مشروع جديد
          </button>
        </div>
      ) : (
        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {projects.map((project) => {
            const isSelected = project.id === selectedProjectId;
            const formattedDate = new Date(project.updatedAt || project.createdAt).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`group relative p-4 rounded-xl border text-right cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-50/50 border-amber-300 shadow-sm ring-1 ring-amber-300/30'
                    : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50/80 hover:border-slate-200'
                }`}
              >
                {/* Trash button */}
                <button
                  onClick={(e) => onDeleteProject(project.id, e)}
                  title="حذف المشروع"
                  className="absolute left-3 top-3 opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition-all duration-150 z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Content type badge */}
                <span className="inline-block bg-white text-slate-600 px-2.5 py-0.5 rounded-md text-[10px] font-bold border border-slate-200/80 mb-2">
                  {project.contentType}
                </span>

                <h4 className="font-bold text-slate-800 text-sm line-clamp-1 mb-1 pl-6">
                  {project.title}
                </h4>

                <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{project.channelName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{project.duration} دقائق</span>
                  </div>
                  <div className="flex items-center gap-1 col-span-2">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
