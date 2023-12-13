export interface Boxes {
  id: number;
  inf: string;
  inf1: string;
  inf2: string;
  inf3: string;
  inf4: string;
  inf5: string;
  name: string;
  icon: object;
  icon_source: string;

}
export const boxes =[
  {
    id: 1,
    inf: 'Verwalten Sie die',
    inf1: 'Einstellungen Ihres',
    inf2: 'Teilers',
    name:'Konfiguration',
    icon:"bi bi-gear-fill",
    icon_source: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css",
  },
  {
    id: 2,
    inf:'Benutzer',
    inf1: 'verwalten',
    name:'Benutzer',
    icon:"bi bi-people-fill",
  },
  {
    id: 3,
    inf: '1 derzeit',
    inf1: 'registrierter',
    inf2: 'Suchbroker',
    name:'Suchbroker',
    icon:"bi bi-diagram-3-fill",
  },
  {
    id: 4,
    inf: 'Aufgaben derzeit',
    inf1:'geplant',
    name: 'Geplante Aufgaben',
    icon:"bi bi-list-check",
  },
  {
    id: 5,
    inf:'Zugangsdaten für',
    inf1:'Suchbroker und',
    inf2:'andere Dienste',
    inf3:'verwalten',
    name:'Zugangsdaten',
    icon:"bi bi-key-fill",
  },
  {
    id:6,
    inf:'Hier können Sie',
    inf1:'einstellen, wie',
    inf2: 'eingehende',
    inf3: 'Suchanfragen',
    inf4: 'behandelt werden',
    inf5:'sollen',
    name:'Behandlung von Suchanfragen',
    icon:"bi bi-reply-all-fill",
  },
  {
    id:7,
    inf:'Hier können Sie',
    inf1:'Qualitätsberichte',
    inf2: 'erzeugen und',
    inf3:'ansehen',
    name:'Qualitätsbericht',
    icon:"bi bi-file-earmark-x",
  },
  {
    id:8,
    inf:'Ereignisse',
    inf1:'überprüfen',
    name:'Log',
    icon:"bi bi-terminal",
  },
  {
    id:9,
    inf:'Liste vorheriger',
    inf1:'Uploads',
    name:'Uploads',
    icon:"bi bi-upload",
  },
  {
    id: 10,
    inf:'Überprüfen Sie die',
    inf1:'Kommunikation',
    inf2: 'mit anderen',
    inf3:'Komponenten',
    name:'Funktionstest',
    icon:"bi bi-plug-fill"
  },
]
