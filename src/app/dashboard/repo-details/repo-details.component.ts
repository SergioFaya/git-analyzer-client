import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GitgraphCommitOptions, GitgraphOptions, Mode, TemplateName } from '@gitgraph/core';
import { createGitgraph } from '@gitgraph/js';
import { Chart } from 'chart.js';
import PieChartContributionsVM from '../../models/PieChartContributionsVM';
import { ChartService } from '../../services/ChartService/chart.service';
import { DataService } from '../../services/DisplayEvents/display-data.service';

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

	private chartCommits!: Chart;
	private chartAddedLines!: Chart;
	private chartRemovedLines!: Chart;

	public repo: any;
	public contributions!: Array<PieChartContributionsVM>;
	private labelsPre: any = [];

	private colors = Array<string>();
	private dataPre: any = [];
	private insertedLines: any = [];
	private removedLines: any = [];
	public loading: boolean = false;

	constructor(private dataService: DataService, private chartService: ChartService) {
		this.loading = true;
	}

	// Somewhere under the class constructor we want to wait for our view
	// to initialize
	ngAfterViewInit() {

	}

	// change get elemet by id por tag #canvas
	ngOnInit() {
		this.colors = [];
		let i = 0;
		while (i < 15) {
			this.colors.push(this.getRandomColor());
			i++;
		}
		this.dataService.repo.subscribe((repo) => {
			this.repo = repo;
			this.getContributorsForCharts(this.repo.full_name);
			this.getGitGraphData(this.repo.full_name);
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

	private getRandomColor(): string {
		const r = Math.floor(Math.random() * 200);
		const g = Math.floor(Math.random() * 200);
		const b = Math.floor(Math.random() * 200);
		return 'rgb(' + r + ', ' + g + ', ' + b + ')';
	}

	getContributorsForCharts(reponame: string) {
		this.chartService.getContributorsForPieChart(reponame)
			.then((result) => {
				this.loading = false;
				this.contributions = result.contributionsVM as Array<PieChartContributionsVM>;
				this.contributions.map((contrib: PieChartContributionsVM) => {
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

	getGitGraphData(reponame: string) {

		this.chartService.getParsedDataForGitGraph(reponame)
			.then((result) => {
				//this.displayNetworkChart(result);
				this.displayGitgraphChart(result);
			})
			.catch((err) => {
				console.log(err);
			});

	}




	private data: any = [];
	private commitsDataCopy = [];

	// establece un nombre para las ramas
	private branchNames: any = ["master"];
	// rama padre ? 
	private parentBranch: any = {};

	// network graph with gitgraph
	displayGitgraphChart(result: any) {
		this.data = result.nodes;
		console.log(this.data.length);
		this.data.reverse();
		this.commitsDataCopy = result.nodes.map((x: any) => Object.assign({}, x));
		const gitGraphOptions: GitgraphOptions = {
			template: TemplateName.BlackArrow,
			mode: Mode.Compact,
			//orientation: Orientation.VerticalReverse

		};
		const gitGraph = createGitgraph(this.gitGraphDiv.nativeElement, gitGraphOptions);
		this.paint(gitGraph);
		// const options: GitgraphBranchOptions<any> = {
		// 	name: 'branch'
		// };

		// const commit: GitgraphCommitOptions<any> = {
		// 	author: 'sergio',
		// 	tag: 'tag',
		// 	subject: 'whatever',
		// 	body: 'body'
		// };
	}

	getBranch(graph: any, parent: any) {
		if (this.parentBranch[parent]) {
			return this.parentBranch[parent]
		}
		return this.createBranch(graph, null, parent);
	}

	createCommit(branch: any, commit: any) {
		const commitOptions: GitgraphCommitOptions<any> = {
			author: commit.label.split('-')[1],
			tag: commit.label,
			hash: commit.label.split('-')[0],
			//subject: 'whatever',
			//body: 'body'
		};
		return branch.commit(commitOptions);
	}

	createBranch(graph: any, branch: any, space: any) {
		const branchOptions = {
			parentBranch: branch,
			name: this.branchNames.pop() || "branch " + space,
			column: space
		};
		return graph.branch(branchOptions);
	}

	hasNoParents(commit: any) {
		if (commit.parents) {
			return commit.parents.length === 0;
		}
		return true;
	}

	hasSingleParentOnSameBranch(commit: any) {
		// sustituir lo de la derecha por un check en la rama
		return commit.parents.length === 1 && this.isOnSameBranchThatParent(commit);
	}

	isOnSameBranchThatParent(commit: any) {
		//return commit.space === commit.parents[0][2];
		var isOnBranch = this.commitsDataCopy.find((node: any) => {
			return node.id === commit.parents[0] && commit.x === node.x;
		});
		return isOnBranch !== undefined;

	}

	getParentSpace(parentId: string) {
		var commitFound: any = this.commitsDataCopy.find((node: any) => {
			return node.id === parentId;
		});
		if (commitFound) {
			return commitFound.x;
		}
		return -1;
	}

	hasSingleParentOnOtherBranch(commit: any) {
		return commit.parents.length === 1 && !this.isOnSameBranchThatParent(commit);
	}

	getFirstParentId(commit: any) {
		return commit.parents[0];
	}

	getSecondParentId(commit: any) {
		return commit.parents[1];
	}

	paint(graph: any) {
		var commit;
		this.parentBranch = {};
		// quitar lo del space por lógica de orden de parents
		console.log(this.data);
		while (commit = this.data.shift()) {

			var branch;

			if (this.hasNoParents(commit)) {

				branch = this.parentBranch[commit.id] = this.createBranch(graph, null, commit.x);

				this.createCommit(branch, commit);
			} else if (this.hasSingleParentOnSameBranch(commit)) {

				branch = this.parentBranch[commit.id] = this.getBranch(graph, this.getFirstParentId(commit));

				this.createCommit(branch, commit);
			} else if (this.hasSingleParentOnOtherBranch(commit)) {

				branch = this.parentBranch[commit.id] = this.createBranch(graph, this.getBranch(graph, this.getFirstParentId(commit)), commit.x);

				this.createCommit(branch, commit);
			} else if (commit.parents.length === 2) {
				// lo del space no se para que es aquí, creo que es para ver si pertenecen a la misma rama
				if (commit.x === this.getParentSpace(commit.parents[0])) {
					branch = this.getBranch(graph, commit.parents[0]);
					this.getBranch(graph, this.getSecondParentId(commit)).merge(branch, { message: commit.message });
				}
				else {
					branch = this.createBranch(graph, this.getBranch(graph, commit.parents[0]), commit.x);
					this.getBranch(graph, this.getSecondParentId(commit)).merge(branch, { message: commit.message });
				}
				this.parentBranch[commit.id] = branch;
			}
		}
	}

	// network chart with sigma - not working
	async displayNetworkChart(result: any) {
		require('../../../../node_modules/sigma/build/sigma.min.js');
		var sigma = require('sigma')
		console.log(sigma);
		var s = new sigma(
			{
				renderer: {
					container: this.gitGraphDiv.nativeElement,
					type: 'canvas'
				},
				settings: {
					minEdgeSize: 0.1,
					maxEdgeSize: 5,
					minNodeSize: 1,
					maxNodeSize: 10,
				}
			}
		);
		// Load the graph in sigma
		await s.graph.read(result);
		// Ask sigma to draw it
		await s.refresh();
	}
}
