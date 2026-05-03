# Solar Badge pour Home-Assistant

## Fonctionnalités

Permet d'afficher les informations liées a la production solaire dans un badge.

- État de consommation
  - GRID dès qu'une partie de l'énergie est importé depuis le réseau.
  - AUTO dès que la production solaire et/ou la batterie permet l'auto-alimentation.
  - EXP  dès qu'une surproduction est détectée que que de l'énergie est revoyée dans le réseau.
- Consommation depuis le réseau
  - Valeure positive si de l'énergie est importée depuis le réseaux
  - Valeure négative si de l'énergie est exportée sur le réseaux
- Consommation solaire
- État de charge ou de décharge de la batterie et suivi de la consommation.
  - Vert si la batterie se charge, la valeur est positive
  - Rouge si la batterie se décharge, la valeur est négative
- Pourcentage de charge de la batterie
  - Rouge si < 40%
  - Organge si > 40%
  - Vert si > 80%
## Aperçu

**GRID**
<img width="274" height="78" alt="image" src="https://github.com/user-attachments/assets/b873176e-425a-4f93-a2bb-6437575c708b" />

**AUTO**
<img width="419" height="61" alt="image" src="https://github.com/user-attachments/assets/1b01ad52-373e-4fde-b643-d1722daa79c7" />

**EXPORT**
<img width="422" height="69" alt="image" src="https://github.com/user-attachments/assets/94fc1a34-56f4-4ae3-bf33-4cff061fed87" />

**CHARGE BATTERIE**
<img width="351" height="65" alt="image" src="https://github.com/user-attachments/assets/569330c8-f64e-43a2-af57-68cf39376433" />

**DÉCHARGE BATTERIE**
<img width="350" height="67" alt="image" src="https://github.com/user-attachments/assets/adae925f-4bf8-459e-9e84-e51d5b46569f" />


## Installation

### Manuel

1. Copier le répertoire `solar-badge` dans le répertoire: `config/www`.
2. "Modifier le tableau de bord" > "Gérer les ressources" > "Ajouter une ressource"
3. "Module Javascript"
4. Ajouter l'URL ci-dessous:
```
/local/solar-badge/solar-badge.js
```

## Configurations

```yaml
type: custom:ha-solar-badge
global_power: sensor.global_power
solar_power: sensor.solar_power
battery_power: sensor.battery_power
battery_level: sensor.battery_level
```
