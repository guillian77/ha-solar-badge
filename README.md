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
