import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { IPieChartContributionsVM } from 'git-analyzer-types';
// @ts-ignore
import { sigma as Sigma } from 'sigma';
import { ChartService } from '../../services/ChartService/chart.service';
import { DisplayDashboardService } from '../../services/DisplayEvents/display-data.service';
import { addClassToElement, generateRandomColor, getUserDataFromLocalStorage, removeClassFromElement } from '../../util/util';
@Component({
	selector: 'app-repo-details',
	templateUrl: './repo-details.component.html',
	styleUrls: ['./repo-details.component.scss']
})
export class RepoDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
	// como el document.getelementbyid de angular
	@ViewChild('commits')
	private canvasCommits!: ElementRef;
	@ViewChild('added')
	private canvasAdded!: ElementRef;
	@ViewChild('removed')
	private canvasRemoved!: ElementRef;
	@ViewChild('gitGraph')
	private gitGraphDiv!: ElementRef;
	@ViewChild('overTooltip')
	private overTooltip!: ElementRef;

	@HostListener('document:mousemove', ['$event'])
	onMouseMove(e: any) {
		this.mouseX = e.pageX;
		this.mouseY = e.pageY;
	}

	private mouseY: number = 0;
	private mouseX: number = 0;

	private chartCommits!: Chart;
	private chartAddedLines!: Chart;
	private chartRemovedLines!: Chart;

	public repo: any;
	public contributions!: Array<IPieChartContributionsVM>;
	public loading: boolean = false;

	private colors = Array<string>();
	private labelsPre: any = [];
	private dataPre: any = [];
	private insertedLines: any = [];
	private removedLines: any = [];

	constructor(private dataService: DisplayDashboardService, private chartService: ChartService) {
		this.loading = true;
	}

	// Somewhere under the class constructor we want to wait for our view
	// to initialize
	ngAfterViewInit() {
		this.loadNetworkGraph();
	}

	loadNetworkGraph() {
		const username = getUserDataFromLocalStorage().login;
		this.getGitGraphData(username!, this.repo.full_name);
	}

	ngOnInit() {
		this.colors = [];
		let i = 0;
		while (i < 15) {
			this.colors.push(generateRandomColor());
			i++;
		}
		this.dataService.repo.subscribe((repo) => {
			this.repo = repo;
			this.getContributorsForCharts(this.repo.full_name);
		});
	}

	ngOnDestroy(): void {
		this.chartCommits.destroy();
		this.chartAddedLines.destroy();
		this.chartRemovedLines.destroy();
	}

	/**
	 * Represents a chart with the desired data and colors on the referencied element
	 * @param canvas ElementRef to the canvas where the chart is inserted
	 * @param dataSet Set of data to be represented
	 * @param colors Color assigned to each data set
	 * @param label label displayed
	 * @param text text of the title charts
	 */
	representChart(canvas: ElementRef, dataSet: Array<number>, colors: Array<string>, labels: Array<string>, text: string) {
		const context: CanvasRenderingContext2D = (<HTMLCanvasElement>canvas.nativeElement).getContext('2d') as CanvasRenderingContext2D;
		return new Chart(context, {
			type: 'pie',
			data: {
				labels: labels,
				datasets: [{
					// label: label,
					data: dataSet,
					backgroundColor: colors,
					borderWidth: 1,
				}]
			},
			options: {
				responsive: false,
				title: {
					display: true,
					text: text
				}
			}
		});
	}

	getContributorsForCharts(reponame: string) {
		this.chartService.getContributorsForPieChart(reponame)
			.then((result) => {
				this.loading = false;
				this.contributions = result.contributionsVM as Array<IPieChartContributionsVM>;
				this.contributions.map((contrib: IPieChartContributionsVM) => {
					this.dataPre.push(contrib.modifications.c);
					this.insertedLines.push(contrib.modifications.a);
					this.removedLines.push(contrib.modifications.d);
					this.labelsPre.push(contrib.login);
				});
			}).then(() => {
				// PIE CHARTS
				this.chartCommits = this.representChart(this.canvasCommits, this.dataPre, this.colors, this.labelsPre, '# of commits');
				this.chartAddedLines = this.representChart(this.canvasAdded, this.insertedLines, this.colors, this.labelsPre, '# of added lines');
				this.chartRemovedLines =
					this.representChart(this.canvasRemoved, this.removedLines, this.colors, this.labelsPre, '# of removed lines');
			})
			.catch((err) => {
				console.log(err);
			});
	}

	getGitGraphData(username: string, reponame: string) {
		this.chartService.getParsedDataForGitGraph(username, reponame)
			.then((result) => {
				this.displayNetworkChart(result);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	/**
	 * Represents the git network graph and binds the necessary events
	 * @param result 
	 */
	displayNetworkChart(result: any) {
		// adapts the canvas size to the size of the chart to fit inside the scroller
		this.gitGraphDiv.nativeElement.style.height = result.height + 'px';
		// Create the graph and load data
		var s = this.newSigmaGraph('canvas', 'arrow');
		s.graph.read(result);
		// EVENTS
		s.bind('outNode', (e: any) => {
			this.outNode();
		});
		s.bind('overNode', (e: any) => {
			this.inNode();
			this.moveTooltipToMousePosition();
		});
		// draw
		s.refresh();
	}

	private moveTooltipToMousePosition() {
		this.overTooltip.nativeElement.style.top = this.mouseY + 'px';
		this.overTooltip.nativeElement.style.left = this.mouseX + 'px';
	}

	/**
	 * Builds a new graph based on domType canvas, WebGL or SVG and the arrowType 
	 * https://github.com/jacomyal/sigma.js/wiki
	 * @param domType 
	 * @param arrowType 
	 */
	private newSigmaGraph(domType: string, arrowType: string) {
		return new Sigma({
			renderer: {
				container: this.gitGraphDiv.nativeElement,
				type: domType
			}, edges: {
				type: arrowType
			}, settings: {
				zoomingRatio: 1,
				enableCamera: false,
				batchEdgesDrawing: true,
				minEdgeSize: 0.5,
				maxEdgeSize: 4,
				// hacer tamaño dependiente del tamaño del grafoo¡,
				minNodeSize: 1,
				maxNodeSize: 8
			}
		});
	}

	private inNode() {
		removeClassFromElement(this.overTooltip, 'hide-tooltip');
		addClassToElement(this.overTooltip, 'show-tooltip');
	}

	private outNode() {
		removeClassFromElement(this.overTooltip, 'show-tooltip');
		addClassToElement(this.overTooltip, 'hide-tooltip');
	}
}
